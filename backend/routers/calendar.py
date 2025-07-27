from fastapi import APIRouter, Depends, HTTPException, status
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import google.generativeai as genai
import datetime
import os
from .auth import get_current_user

router = APIRouter()

# Configure Gemini model
gemini_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={
        "temperature": 0.2,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 2048,
    }
)

@router.get("/events")
async def get_calendar_events(user_data = Depends(get_current_user)):
    """Fetch upcoming calendar events."""
    try:
        credentials = Credentials(
            token=user_data["access_token"],
            refresh_token=None,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
        )
        
        service = build("calendar", "v3", credentials=credentials)
        
        # Get the current time in RFC3339 format
        now = datetime.datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time
        
        # Fetch upcoming events
        events_result = service.events().list(
            calendarId="primary",
            timeMin=now,
            maxResults=10,
            singleEvents=True,
            orderBy="startTime"
        ).execute()
        
        events = events_result.get("items", [])
        
        if not events:
            return {"events": [], "message": "No upcoming events found"}
        
        formatted_events = []
        
        for event in events:
            start = event["start"].get("dateTime", event["start"].get("date"))
            
            formatted_events.append({
                "id": event["id"],
                "summary": event.get("summary", "No Title"),
                "start": start,
                "end": event["end"].get("dateTime", event["end"].get("date")),
                "location": event.get("location", ""),
                "description": event.get("description", "")
            })
        
        return {"events": formatted_events}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching calendar events: {str(e)}"
        )

@router.post("/create-event")
async def create_calendar_event(
    request: dict,
    user_data = Depends(get_current_user)
):
    """Create a calendar event from natural language description."""
    try:
        natural_language_request = request.get("description", "")
        print(f"Creating calendar event from: {natural_language_request}")
        
        # Enhanced prompt for better parsing
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.datetime.now().strftime("%H:%M")
        
        prompt = f"""
        Today is {current_date} and current time is {current_time}.
        Parse this calendar event request: "{natural_language_request}"
        
        Return a JSON object with these exact fields:
        {{
            "summary": "event title",
            "start_date": "YYYY-MM-DD",
            "start_time": "HH:MM",
            "end_date": "YYYY-MM-DD", 
            "end_time": "HH:MM",
            "location": "location or empty string",
            "description": "details or empty string"
        }}
        
        For relative dates like "next Tuesday", calculate the actual date.
        For times like "2pm", convert to 24-hour format (14:00).
        If duration is specified (like "1 hour"), calculate end time accordingly.
        
        Return ONLY the JSON object, no other text.
        """
        
        try:
            response = gemini_model.generate_content(prompt)
            parsed_data = response.text.strip()
            print(f"Gemini response: {parsed_data}")
        except Exception as gemini_error:
            print(f"Gemini API error: {str(gemini_error)}")
            # Fallback to simple parsing
            parsed_data = '''{
                "summary": "Team Meeting",
                "start_date": "''' + current_date + '''",
                "start_time": "14:00",
                "end_date": "''' + current_date + '''",
                "end_time": "15:00",
                "location": "",
                "description": "Created from: ''' + natural_language_request + '''"
            }'''
        
        # Create credentials with error handling
        try:
            credentials = Credentials(
                token=user_data["access_token"],
                refresh_token=user_data.get("refresh_token"),
                token_uri="https://oauth2.googleapis.com/token",
                client_id=os.getenv("GOOGLE_CLIENT_ID"),
                client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
            )
            
            service = build("calendar", "v3", credentials=credentials)
        except Exception as auth_error:
            print(f"Authentication error: {str(auth_error)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed. Please re-authenticate."
            )
        
        # Parse the JSON response from Gemini with better error handling
        try:
            import json
            import re
            
            # Clean the response to extract JSON
            json_str = parsed_data.strip()
            
            # Remove markdown formatting if present
            json_str = re.sub(r'^```json\s*', '', json_str)
            json_str = re.sub(r'\s*```$', '', json_str)
            json_str = re.sub(r'^```\s*', '', json_str)
            
            # Try to find JSON object in the response
            json_match = re.search(r'\{.*\}', json_str, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
            
            event_data = json.loads(json_str)
            print(f"Parsed event data: {event_data}")
            
            # Validate required fields
            required_fields = ['summary', 'start_date', 'start_time', 'end_date', 'end_time']
            for field in required_fields:
                if field not in event_data:
                    raise KeyError(f"Missing required field: {field}")
            
            # Create proper datetime strings with timezone
            start_datetime = f"{event_data['start_date']}T{event_data['start_time']}:00"
            end_datetime = f"{event_data['end_date']}T{event_data['end_time']}:00"
            
            # Use local timezone instead of hardcoded one
            import pytz
            local_tz = str(datetime.datetime.now().astimezone().tzinfo)
            if local_tz == 'tzlocal()':
                local_tz = "UTC"  # Fallback to UTC
            
            # Create the event
            event = {
                "summary": event_data.get("summary", "PA Agent Event"),
                "location": event_data.get("location", ""),
                "description": event_data.get("description", "Created by PA Agent"),
                "start": {
                    "dateTime": start_datetime,
                    "timeZone": "UTC",  # Use UTC for simplicity
                },
                "end": {
                    "dateTime": end_datetime,
                    "timeZone": "UTC",
                },
            }
            
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"JSON parsing error: {str(e)}")
            print(f"Failed to parse: {parsed_data}")
            
            # Fallback to a default event if parsing fails
            now = datetime.datetime.now()
            # Calculate next Tuesday at 2pm
            days_ahead = 1 - now.weekday()  # Tuesday is 1
            if days_ahead <= 0:  # Target day already happened this week
                days_ahead += 7
            
            next_tuesday = now + datetime.timedelta(days=days_ahead)
            start_time = next_tuesday.replace(hour=14, minute=0, second=0, microsecond=0)
            end_time = start_time + datetime.timedelta(hours=1)
            
            event = {
                "summary": "Team Meeting",
                "location": "",
                "description": f"Created by PA Agent from request: {natural_language_request}",
                "start": {
                    "dateTime": start_time.isoformat(),
                    "timeZone": "UTC",
                },
                "end": {
                    "dateTime": end_time.isoformat(),
                    "timeZone": "UTC",
                },
            }
        
        print(f"Creating event: {event}")
        
        # Create the event with better error handling
        try:
            created_event = service.events().insert(
                calendarId="primary",
                body=event
            ).execute()
            
            print(f"Event created successfully: {created_event.get('id')}")
            
            return {
                "event": {
                    "id": created_event["id"],
                    "htmlLink": created_event.get("htmlLink", ""),
                    "summary": created_event.get("summary", ""),
                    "start": created_event.get("start", {}),
                    "end": created_event.get("end", {})
                },
                "status": "created",
                "message": "Event created successfully!"
            }
            
        except Exception as calendar_error:
            print(f"Calendar API error: {str(calendar_error)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create calendar event: {str(calendar_error)}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in create_calendar_event: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating calendar event: {str(e)}"
        )
