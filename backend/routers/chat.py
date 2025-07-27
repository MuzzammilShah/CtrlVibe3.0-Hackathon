from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import StreamingResponse
import google.generativeai as genai
import json
import os
import datetime
from typing import List, Dict, Any
import asyncio

router = APIRouter()

@router.get("/test")
async def test_chat():
    """Test endpoint to verify chat functionality."""
    try:
        response = gemini_model.generate_content("Say hello and confirm you're working!")
        return {
            "status": "success",
            "response": response.text,
            "gemini_working": True
        }
    except Exception as e:
        error_msg = str(e)
        if "quota" in error_msg.lower() or "429" in error_msg:
            return {
                "status": "quota_exceeded",
                "response": "Gemini API quota exceeded. Using fallback response.",
                "gemini_working": False,
                "error": "Quota exceeded - please wait or upgrade to paid tier"
            }
        return {
            "status": "error",
            "error": error_msg,
            "gemini_working": False
        }

# Configure Gemini model - using flash model for better quota limits
gemini_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",  # Changed from pro to flash for better quota
    generation_config={
        "temperature": 0.2,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 2048,  # Reduced token limit
    }
)

@router.post("/chat")
async def chat_stream(request: Request):
    """Handle chat requests with streaming response for Vercel AI SDK compatibility."""
    try:
        # Parse the request body
        body = await request.json()
        messages = body.get("messages", [])
        
        print(f"Chat request received with {len(messages)} messages")
        
        if not messages:
            raise HTTPException(status_code=400, detail="No messages provided")
        
        # Get the last user message
        last_message = ""
        for msg in reversed(messages):
            if msg["role"] == "user":
                last_message = msg["content"]
                break
        
        if not last_message:
            raise HTTPException(status_code=400, detail="No user message found")
        
        print(f"Processing message: {last_message[:100]}...")
        
        # Generate response using Gemini with quota error handling
        try:
            response = gemini_model.generate_content(last_message)
            response_text = response.text
        except Exception as gemini_error:
            # Handle quota exceeded errors gracefully
            if "quota" in str(gemini_error).lower() or "429" in str(gemini_error):
                response_text = "I'm currently experiencing high usage and need to limit responses. Please try again in a few minutes, or consider upgrading to a paid Gemini API plan for unlimited access."
            else:
                response_text = f"I'm sorry, I encountered an error: {str(gemini_error)[:100]}..."
        
        print(f"Generated response: {response_text[:100]}...")
        
        # Return streaming response in the exact format Vercel AI SDK expects
        def generate_stream():
            try:
                # Use the already generated response_text from above
                # Send the complete response as a single chunk to avoid parsing issues
                chunk_data = {
                    "id": "chatcmpl-123",
                    "object": "chat.completion.chunk",
                    "created": int(datetime.datetime.now().timestamp()),
                    "model": "gemini-2.0-flash",
                    "choices": [{
                        "index": 0,
                        "delta": {
                            "content": response_text
                        },
                        "finish_reason": None
                    }]
                }
                
                yield f"data: {json.dumps(chunk_data)}\n\n"
                
                # Send final chunk with finish_reason
                final_chunk = {
                    "id": "chatcmpl-123",
                    "object": "chat.completion.chunk",
                    "created": int(datetime.datetime.now().timestamp()),
                    "model": "gemini-2.0-flash",
                    "choices": [{
                        "index": 0,
                        "delta": {},
                        "finish_reason": "stop"
                    }]
                }
                yield f"data: {json.dumps(final_chunk)}\n\n"
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                print(f"Error in stream generation: {e}")
                # Send error in the expected format
                error_chunk = {
                    "id": "chatcmpl-123",
                    "object": "chat.completion.chunk",
                    "created": int(datetime.datetime.now().timestamp()),
                    "model": "gemini-2.0-flash",
                    "choices": [{
                        "index": 0,
                        "delta": {
                            "content": f"Error: {str(e)}"
                        },
                        "finish_reason": "stop"
                    }]
                }
                yield f"data: {json.dumps(error_chunk)}\n\n"
                yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        )
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in chat stream: {str(e)}"
        )

@router.post("/chat-simple")
async def chat_simple(request: Request):
    """Simple chat endpoint without streaming."""
    try:
        body = await request.json()
        messages = body.get("messages", [])
        
        if not messages:
            raise HTTPException(status_code=400, detail="No messages provided")
        
        # Get the last user message
        last_message = ""
        for msg in reversed(messages):
            if msg["role"] == "user":
                last_message = msg["content"]
                break
        
        if not last_message:
            raise HTTPException(status_code=400, detail="No user message found")
        
        # Generate response
        try:
            response = gemini_model.generate_content(last_message)
            response_text = response.text
        except Exception as gemini_error:
            if "quota" in str(gemini_error).lower() or "429" in str(gemini_error):
                response_text = "I'm currently experiencing high usage. Please try again in a few minutes."
            else:
                response_text = f"I encountered an error: {str(gemini_error)[:100]}..."
        
        return {
            "response": response_text,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in chat: {str(e)}"
        )
