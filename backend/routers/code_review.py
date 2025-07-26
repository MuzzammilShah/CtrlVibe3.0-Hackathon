from fastapi import APIRouter, HTTPException, status, Request
import google.generativeai as genai
import os

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

@router.post("/review")
async def review_code(request: Request):
    """Review code and provide feedback."""
    try:
        # Parse request body
        body = await request.json()
        code = body.get("code", "")
        language = body.get("language", "unknown")
        review_focus = body.get("review_focus", "general")
        
        if not code:
            raise HTTPException(status_code=400, detail="No code provided for review")
        
        prompt = f"""
        Review the following {language} code with a focus on {review_focus} aspects.
        
        Code to review:
        ```{language}
        {code}
        ```
        
        Please provide:
        1. A summary of the code's purpose and functionality
        2. Key strengths of the implementation
        3. Specific issues or areas for improvement (with line references when possible)
        4. Suggested code changes or alternatives for identified issues
        5. Overall assessment and recommendations
        
        Format your review in a structured way with clear sections.
        """
        
        response = gemini_model.generate_content(prompt)
        review = response.text
        
        return {
            "content": review,
            "code_review": review  # Keep both for compatibility
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reviewing code: {str(e)}"
        )

@router.post("/suggest-refactoring")
async def suggest_refactoring(request: Request):
    """Suggest refactoring for given code based on a specific goal."""
    try:
        body = await request.json()
        code = body.get("code", "")
        language = body.get("language", "unknown")
        refactoring_goal = body.get("refactoring_goal", "improve code quality")
        
        if not code:
            raise HTTPException(status_code=400, detail="No code provided for refactoring")
        
        prompt = f"""
        Analyze the following {language} code and suggest refactoring to achieve the goal: {refactoring_goal}
        
        Original code:
        ```{language}
        {code}
        ```
        
        Please provide:
        1. An analysis of the current code structure and potential issues
        2. A detailed refactoring plan with specific changes
        3. The refactored code with comments explaining key changes
        4. Benefits of the suggested refactoring
        
        Format your response in a structured way with clear sections.
        """
        
        response = gemini_model.generate_content(prompt)
        refactoring = response.text
        
        return {
            "content": refactoring,
            "refactoring_suggestions": refactoring  # Keep both for compatibility
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating refactoring suggestions: {str(e)}"
        )

@router.post("/explain")
async def explain_code(request: Request):
    """Explain code functionality in natural language."""
    try:
        body = await request.json()
        code = body.get("code", "")
        language = body.get("language", "unknown")
        detail_level = body.get("detail_level", "medium")  # Options: basic, medium, detailed
        
        if not code:
            raise HTTPException(status_code=400, detail="No code provided for explanation")
        
        prompt = f"""
        Explain the following {language} code at a {detail_level} level of detail.
        
        Code to explain:
        ```{language}
        {code}
        ```
        
        Please provide:
        1. A high-level summary of what the code does
        2. An explanation of the key components and their interactions
        3. A walkthrough of the logic and control flow
        4. Explanations of any complex or non-obvious parts
        
        Format your explanation in a clear, educational style that would help someone understand this code.
        """
        
        response = gemini_model.generate_content(prompt)
        explanation = response.text
        
        return {
            "content": explanation,
            "code_explanation": explanation  # Keep both for compatibility
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error explaining code: {str(e)}"
        )
