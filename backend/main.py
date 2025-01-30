from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import json
import requests

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000", "http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")
PROVIDER_URL = os.getenv("PROVIDER_URL")
LLM_MODEL = os.getenv("LLM_MODEL")


def llm_request(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
    }

    try:
        response = requests.post(PROVIDER_URL, headers=headers, json=data, timeout=120)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"LLM provider error: {str(e)}")


def generate_subtopics(formdata: dict):
    SUBTOPICS_PROMPT = """
        <purpose>
            You are an AI COURSE OUTLINE SPECIALIST designed to generate comprehensive course outlines based on the user’s topic, goal, and knowledge level.
            Your objective is to produce a JSON-formatted list of subtopics that progresses logically from easy to difficult.
        </purpose>

        <instructions>
            <instruction>Review the user's topic, goal, and background knowledge.</instruction>
            <instruction>Create a sorted list of unique subtopics starting from the easiest to the most advanced concepts.</instruction>
            <instruction>Focus on the user's specific goal and tailor the subtopics accordingly.</instruction>
            <instruction>Output the subtopics strictly in JSON format under the key "subtopics," without additional text or code blocks.</instruction>
            <instruction>Use commas within the JSON array and avoid any other punctuation.</instruction>
            <instruction>Adapt the language of the final output to match the user’s input language.</instruction>
            <instruction>Do not include introductory or concluding statements; provide only the JSON object.</instruction>
            <instruction>Ensure a clear and natural progression to facilitate effective learning.</instruction>
        </instructions>

        <examples>
            <example>
                <user-request>
                    Topic: Basics of Photography
                    Goal: I want to learn how to take great landscape shots and understand camera settings.
                    Background: Beginner
                </user-request>
                <sample-response>
                    {
                        "subtopics": [
                            "Introduction to Camera Types",
                            "Essential Camera Settings",
                            "Understanding Aperture and Shutter Speed",
                            "Lighting and Composition Basics",
                            "Landscape Photography Techniques",
                            "Post-Processing Essentials"
                        ]
                    }
                </sample-response>
            </example>
            <example>
                <user-request>
                    Topic: Introduction to Data Science
                    Goal: Understand the fundamentals before taking on complex machine learning algorithms.
                    Background: Intermediate
                </user-request>
                <sample-response>
                    {
                        "subtopics": [
                            "Data Science Overview",
                            "Key Python Libraries for Data Analysis",
                            "Data Cleaning and Preprocessing",
                            "Exploratory Data Analysis",
                            "Introduction to Machine Learning Concepts",
                            "Basic Regression and Classification"
                        ]
                    }
                </sample-response>
            </example>
            <example>
                <user-request>
                    Topic: Advanced Spanish Grammar
                    Goal: Master nuanced grammar rules for professional writing and conversation.
                    Background: Advanced
                </user-request>
                <sample-response>
                    {
                        "subtopics": [
                            "Grammar Review and Sentence Structure",
                            "Subjunctive Mood in Complex Sentences",
                            "Advanced Use of Tenses (Imperfect, Pluperfect)",
                            "Reflexive and Reciprocal Verbs",
                            "Nuanced Pronoun Usage",
                            "Formal Writing and Stylistic Conventions"
                        ]
                    }
                </sample-response>
            </example>
        </examples>

        <user-prompt>
    """
    prompt = f"""
    {SUBTOPICS_PROMPT}
    ### Topic:
    {formdata['topic']}

    ### Goal:
    {formdata['goal']}

    ### Background:
    {formdata['background']}
    </user-prompt>
    """

    response = llm_request(prompt)
    return json.loads(response)


def generate_content(maintopic: str, subtopics: list, subtopic: str):
    COURSE_PROMPT = """
        <purpose>
            You are an expert educational content creator specializing in developing comprehensive and detailed course materials focused on specific subtopics.
            Your goal is to craft a standalone course section for the provided subtopic, offering a clear introduction, thorough explanation, and a practical exercise for immediate application.
        </purpose>

        <instructions>
            <instruction>Provide a brief introduction (1–3 sentences) explaining the essence of the subtopic.</instruction>
            <instruction>Deliver an in-depth explanation of the subtopic, including key concepts, definitions, and principles.</instruction>
            <instruction>Illustrate complex ideas with clear, relevant examples to enhance comprehension.</instruction>
            <instruction>Design a practical exercise or activity to reinforce understanding and application of the subtopic.</instruction>
            <instruction>Focus exclusively on the provided subtopic—omit references to other course sections.</instruction>
            <instruction>Ensure accuracy and clarity in all information provided.</instruction>
            <instruction>Format the final output in Markdown, starting with a level-one heading (#) for the subtopic title, followed by appropriately ordered headings.</instruction>
            <instruction>Avoid addressing the user directly; present the material in a professional, educational tone.</instruction>
            <instruction>Keep the writing concise, precise, and neatly structured for an optimal learning experience.</instruction>
        </instructions>

        <sections>
            <section>
                <title>Introduction to the Subtopic</title>
                <description>Provide a concise overview (1–3 sentences) highlighting the importance and relevance of the subtopic.</description>
            </section>
            <section>
                <title>Detailed Explanation</title>
                <description>Include in-depth coverage of key concepts, definitions, principles, and examples to ensure thorough understanding.</description>
            </section>
            <section>
                <title>Practical Exercise</title>
                <description>Offer a self-contained activity or exercise that allows learners to apply and test their knowledge of the subtopic.</description>
            </section>
        </sections>

        <user-prompt>
    """

    prompt = f"""
        {COURSE_PROMPT}
        ### Maintopic:
        {maintopic}

        ### Subtopics:
        {subtopics}

        ### Subtopic:
        {subtopic}
        </user-prompt>
    """
    content = llm_request(prompt)
    return {"subtopic": subtopic, "content": content}


def generate_recommendations(courses: dict):
    RECOMMENDATIONS_PROMPT = """
        <purpose>
            You are an AI COURSE RECOMMENDATION SPECIALIST designed to generate comprehensive course recommendations based on user input.
            Your expertise ensures tailored course recommendations that align with the user's interests and learning style.
        </purpose>

        <instructions>
            <instruction>Create a JSON-formatted course recommendation based on the list of courses the user has completed.</instruction>
            <instruction>Focus on the user’s interests and already completed courses when selecting recommended courses.</instruction>
            <instruction>Ensure recommended courses are unique and avoid repetition.</instruction>
            <instruction>Adapt the language of the recommendations to match the majority language of the provided courses.</instruction>
            <instruction>Avoid any introductory or concluding text such as “Here is your course recommendation...”</instruction>
            <instruction>Provide at most 4 recommended courses.</instruction>
            <instruction>Make each recommendation’s goal detailed and extensive.</instruction>
            <instruction>Keep the course topic short (maximum 3 words).</instruction>
            <instruction>Output a JSON object with the key "recommendations" containing an array of recommended courses.</instruction>
            <instruction>Do not enclose the JSON object in a code block; return it as plain text.</instruction>
        </instructions>

        <examples>
            <example>
                {
                    "recommendations": [
                        {
                            "topic": "How to do a backflip",
                            "goal": "I want to learn how i can do a backflip to improve my fitness and confidence",
                            "background": "Professional"
                        },
                        {
                            "topic": "How to manage my personal finances",
                            "goal": "I want to learn how to manage my personal finance and investments to live a comfortable life",
                            "background": "Beginner"
                        },
                        {
                            "topic": "Speaking in public",
                            "goal": "Learn how to speak in public to maximize my career opportunities",
                            "background": "Intermediate"
                        },
                        {
                            "topic": "How to create a website",
                            "goal": "Learn how to create a website to showcase my resume and projects",
                            "background": "Beginner"
                        }
                    ]
                }
            </example>
        </examples>

        <user-prompt>
    """
    prompt = f"""
    {RECOMMENDATIONS_PROMPT}
    ### Courses:
    {courses}
    </user-prompt>
    """
    response = llm_request(prompt)
    return json.loads(response)


@app.post("/generate/subtopics")
def generate_subtopics_endpoint(formdata: dict):
    try:
        subtopics = generate_subtopics(formdata)
        if "subtopics" not in subtopics or not isinstance(subtopics["subtopics"], list):
            raise HTTPException(status_code=500, detail="Invalid response format.")
        return subtopics
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/generate/content")
def generate_content_endpoint(formdata: dict):
    try:
        maintopic = formdata["maintopic"]
        subtopics = formdata["subtopics"]
        subtopic = formdata["subtopic"]
        course_section = generate_content(maintopic, subtopics, subtopic)
        return course_section
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/generate/recommendations")
def generate_recommendations_endpoint(courses: dict):
    try:
        recommendations = generate_recommendations(courses)
        if "recommendations" not in recommendations or not isinstance(recommendations["recommendations"], list):
            raise HTTPException(status_code=500, detail="Invalid response format.")
        return recommendations
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")