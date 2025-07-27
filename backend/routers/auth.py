from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os
import pathlib

router = APIRouter()

# Path to client secret file
CLIENT_SECRET_FILE = os.path.join(pathlib.Path(__file__).parent.parent, "client_secret.json")

# Google OAuth2 setup
SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/calendar.events"
]

# OAuth2 configuration - using HTTPBearer for token validation
oauth2_scheme = HTTPBearer()

@router.get("/login")
async def login_url():
    """Generate Google OAuth login URL."""
    try:
        print(f"Client secret file path: {CLIENT_SECRET_FILE}")
        print(f"Client secret file exists: {os.path.exists(CLIENT_SECRET_FILE)}")
        print(f"Redirect URI: {os.getenv('REDIRECT_URI', 'http://localhost:3000/auth/callback')}")
        
        flow = Flow.from_client_secrets_file(
            CLIENT_SECRET_FILE,
            scopes=SCOPES,
            redirect_uri=os.getenv("REDIRECT_URI", "http://localhost:3000/auth/callback")
        )
        
        auth_url, _ = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent"
        )
        
        print(f"Generated auth URL: {auth_url}")
        return {"auth_url": auth_url}
    except Exception as e:
        print(f"Login URL generation error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating login URL: {str(e)}"
        )

@router.get("/callback")
async def auth_callback(code: str, scope: str = None):
    """Process OAuth callback and exchange code for tokens."""
    try:
        print(f"OAuth callback received with code: {code[:20]}...")
        print(f"Received scope: {scope}")
        
        # Create flow with the exact same configuration as login
        flow = Flow.from_client_secrets_file(
            CLIENT_SECRET_FILE,
            scopes=SCOPES,
            redirect_uri=os.getenv("REDIRECT_URI", "http://localhost:3000/auth/callback")
        )
        
        print(f"Flow created, fetching token...")
        
        # Fetch token without strict scope validation
        flow.fetch_token(
            code=code,
            # Don't validate scopes strictly
        )
        
        credentials = flow.credentials
        
        print(f"Token received: {credentials.token[:20] if credentials.token else 'None'}...")
        
        # Test the credentials by making a simple API call
        try:
            from googleapiclient.discovery import build
            service = build("oauth2", "v2", credentials=credentials)
            user_info = service.userinfo().get().execute()
            print(f"User authenticated: {user_info.get('email', 'Unknown')}")
        except Exception as test_error:
            print(f"Warning: Could not verify credentials: {test_error}")
        
        return {
            "access_token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes
        }
    except Exception as e:
        print(f"OAuth callback error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing OAuth callback: {str(e)}"
        )

async def get_current_user(credentials: HTTPBearer = Depends(oauth2_scheme)):
    """Validate token and return user info."""
    try:
        # Extract token from credentials
        token = credentials.credentials
        
        # Remove "Bearer " prefix if present
        if token.startswith("Bearer "):
            token = token[7:]
            
        creds = Credentials(
            token=token,
            refresh_token=None,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET")
        )
        
        service = build("oauth2", "v2", credentials=creds)
        user_info = service.userinfo().get().execute()
        
        # Return both user info and access token for other API calls
        return {
            "user_info": user_info,
            "access_token": token
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/test-auth")
async def test_auth(user_data = Depends(get_current_user)):
    """Test endpoint to verify authentication is working."""
    try:
        return {
            "status": "authenticated",
            "user_email": user_data.get("user_info", {}).get("email", "Unknown"),
            "token_length": len(user_data.get("access_token", "")),
            "message": "Authentication successful!"
        }
    except Exception as e:
        return {
            "status": "failed",
            "error": str(e),
            "message": "Authentication failed"
        }
