from fastapi import APIRouter, Depends, HTTPException, status
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import google.generativeai as genai
import base64
from email.mime.text import MIMEText
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

@router.get("/unread")
async def get_unread_emails(user_data = Depends(get_current_user)):
    """Fetch unread emails and provide summaries."""
    try:
        credentials = Credentials(
            token=user_data["access_token"],
            refresh_token=None,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
        )
        
        service = build("gmail", "v1", credentials=credentials)
        
        # Fetch unread messages
        results = service.users().messages().list(
            userId="me", 
            q="is:unread"
        ).execute()
        
        messages = results.get("messages", [])
        
        if not messages:
            return {"emails": [], "message": "No unread emails found"}
        
        email_summaries = []
        
        # Process up to 5 emails to avoid rate limits
        for message in messages[:5]:
            email = service.users().messages().get(
                userId="me", 
                id=message["id"],
                format="full"
            ).execute()
            
            # Extract email content
            headers = email["payload"]["headers"]
            subject = next((h["value"] for h in headers if h["name"] == "Subject"), "No Subject")
            sender = next((h["value"] for h in headers if h["name"] == "From"), "Unknown Sender")
            
            # Extract body content (simplified)
            parts = email["payload"].get("parts", [])
            body = ""
            
            if parts:
                for part in parts:
                    if part["mimeType"] == "text/plain":
                        body_data = part["body"].get("data", "")
                        if body_data:
                            body += base64.urlsafe_b64decode(body_data).decode("utf-8")
            else:
                body_data = email["payload"]["body"].get("data", "")
                if body_data:
                    body = base64.urlsafe_b64decode(body_data).decode("utf-8")
            
            # Generate summary with Gemini
            prompt = f"""
            Please summarize this email concisely in 2-3 sentences:
            
            From: {sender}
            Subject: {subject}
            
            {body[:2000]}  # Limit to avoid token issues
            """
            
            response = gemini_model.generate_content(prompt)
            summary = response.text
            
            email_summaries.append({
                "id": message["id"],
                "sender": sender,
                "subject": subject,
                "summary": summary
            })
        
        return {"emails": email_summaries}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching emails: {str(e)}"
        )

@router.post("/draft-reply")
async def draft_email_reply(
    message_id: str,
    tone: str = "professional",
    user_data = Depends(get_current_user)
):
    """Draft a reply to an email using Gemini."""
    try:
        credentials = Credentials(
            token=user_data["access_token"],
            refresh_token=None,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
        )
        
        service = build("gmail", "v1", credentials=credentials)
        
        # Get the email content
        email = service.users().messages().get(
            userId="me", 
            id=message_id,
            format="full"
        ).execute()
        
        # Extract email content
        headers = email["payload"]["headers"]
        subject = next((h["value"] for h in headers if h["name"] == "Subject"), "No Subject")
        sender = next((h["value"] for h in headers if h["name"] == "From"), "Unknown Sender")
        
        # Extract body content (simplified)
        parts = email["payload"].get("parts", [])
        body = ""
        
        if parts:
            for part in parts:
                if part["mimeType"] == "text/plain":
                    body_data = part["body"].get("data", "")
                    if body_data:
                        body += base64.urlsafe_b64decode(body_data).decode("utf-8")
        else:
            body_data = email["payload"]["body"].get("data", "")
            if body_data:
                body = base64.urlsafe_b64decode(body_data).decode("utf-8")
        
        # Generate reply with Gemini
        prompt = f"""
        Please draft a reply to this email in a {tone} tone. 
        The reply should be contextually relevant and address the main points or questions in the email.
        
        Original Email:
        From: {sender}
        Subject: {subject}
        
        {body[:3000]}  # Limit to avoid token issues
        
        Draft a complete reply, including a suitable greeting and sign-off.
        """
        
        response = gemini_model.generate_content(prompt)
        draft_reply = response.text
        
        return {"reply": draft_reply, "subject": f"Re: {subject}", "to": sender}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error drafting reply: {str(e)}"
        )

@router.post("/send")
async def send_email(
    to: str,
    subject: str,
    body: str,
    user_data = Depends(get_current_user)
):
    """Send an email via Gmail API."""
    try:
        credentials = Credentials(
            token=user_data["access_token"],
            refresh_token=None,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
        )
        
        service = build("gmail", "v1", credentials=credentials)
        
        # Create message
        message = MIMEText(body)
        message["to"] = to
        message["subject"] = subject
        
        # Encode message
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")
        
        # Send message
        sent_message = service.users().messages().send(
            userId="me",
            body={"raw": raw_message}
        ).execute()
        
        return {"message_id": sent_message["id"], "status": "sent"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error sending email: {str(e)}"
        )
