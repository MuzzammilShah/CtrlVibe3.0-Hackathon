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
    model_name="gemini-1.5-pro",
    generation_config={
        "temperature": 0.2,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
    }
)

@router.get("/events")
async def get_calendar_events(user_info = Depends(get_current_user)):
    """Fetch upcoming calendar events."""
    try:
        credentials = Credentials(
            token=user_info["access_token"],
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
    natural_language_request: str,
    user_info = Depends(get_current_user)
):
    """Create a calendar event from natural language description."""
    try:
        # Use Gemini to parse the natural language request
        prompt = f"""
        Parse this calendar event request into structured fields.
        Request: "{natural_language_request}"
        
        Extract and return ONLY a JSON object with these fields:
        - summary: the title or subject of the event
        - start_date: in YYYY-MM-DD format
        - start_time: in HH:MM format (24-hour)
        - end_date: in YYYY-MM-DD format (same as start_date if not specified)
        - end_time: in HH:MM format (24-hour, should be after start_time)
        - location: the event location (if specified, otherwise empty string)
        - description: any additional details (if specified, otherwise empty string)
        
        Return ONLY valid JSON without explanations or markdown formatting.
        """
        
        response = gemini_model.generate_content(prompt)
        parsed_data = response.text
        
        # In a production app, properly parse the JSON from the response
        # For simplicity, we're assuming the model returned properly formatted JSON
        
        # Convert to Google Calendar format (simplified)
        # For a production app, properly parse the dates and times
        
        credentials = Credentials(
            token=user_info["access_token"],
            refresh_token=None,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
        )
        
        service = build("calendar", "v3", credentials=credentials)
        
        # Create a sample event (for demonstration purposes)
        # In a production app, use the parsed data from Gemini
        event = {
            "summary": "Sample Event",
            "location": "Virtual",
            "description": "Created by PA Agent",
            "start": {
                "dateTime": "2023-08-01T10:00:00",
                "timeZone": "America/Los_Angeles",
            },
            "end": {
                "dateTime": "2023-08-01T11:00:00",
                "timeZone": "America/Los_Angeles",
            },
        }
        
        created_event = service.events().insert(
            calendarId="primary",
            body=event
        ).execute()
        
        return {
            "id": created_event["id"],
            "htmlLink": created_event["htmlLink"],
            "status": "created",
            "parsed_request": parsed_data
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating calendar event: {str(e)}"
        )
