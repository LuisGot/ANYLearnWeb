from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

app = FastAPI()


origins = [
    "http://localhost:4000",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("API_KEY")
provider_url = os.getenv("PROVIDER_URL")
llm_model = os.getenv("LLM_MODEL")


def llm_request(prompt: str):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    data = {
        "model": llm_model,
        "messages": [{"role": "user", "content": prompt}],
    }

    response = requests.post(provider_url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


def generate_subtopics(formdata: dict):
    SUBTOPICS_PROMPT = """
        ## Introduction  
        - **YOU ARE** an **AI COURSE OUTLINE SPECIALIST** designed to generate comprehensive course outlines based on user input.  
        (Context: "Your expertise ensures tailored course structures that align with the user's goal and knowledge level.")  

        ## Task Description  
        - **YOUR TASK IS** to **CREATE** a JSON-formatted course outline based on a specific topic provided by the user.  
        - The user will provide:  
        - **Topic** they want to explore.  
        - **Their goal** (what they want to find out about this topic).  
        - **Their current level of knowledge** (e.g., beginner, intermediate, advanced).  
        - You will **categorize** the topic into clear **subtopics** arranged **logically from easy to difficult**.  

        ## Rules and Constraints  
        - **FOCUS** on the user’s **goal** and **level of knowledge** when creating the subtopics.  
        - **ENSURE** subtopics are **unique** and avoid repetition.  
        - **FORMAT** your response strictly in JSON with a **"subtopics"** key.  
        - **SORT** subtopics **from easy to difficult** to create a natural learning progression.  
        - **USE** only **commas** within the JSON array (no other punctuation).  
        - **ADAPT** the language of the response to match the **user's input language**.  
        - **AVOID** any introductory or concluding text like "Here is your course outline on...".  

        ## Outcome Expectations  
        - **PROVIDE** a JSON object containing a list of short categorized subtopics under the key **"subtopics"**.
        - **DO NOT** put the JSON object in a code block. Just provide the JSON object as a string.
        - **ENSURE** clarity and logical progression in the subtopic arrangement.

        ## EXAMPLE of required response format:
        {
            "subtopics": [
                "HTML Basics",
                "HTML Structure",
                "Key HTML Tags",
                "CSS Overview",
                "CSS Selectors",
                "CSS Units",
                "Building with HTML & CSS",
                "Styling with CSS",
                "Adding Images & Colors",
                "Creating a Website Layout",
                "Common HTML & CSS Mistakes",
                "Best Practices for Clean Code"
            ]
        }
        ### IMPORTANT:
        - Your precision in categorizing subtopics ensures a seamless learning experience.
        - Logical progression of topics is key to effective knowledge transfer.

        ## User Input:
        """
    prompt = f"""
    {SUBTOPICS_PROMPT}
    ### Topic:
    {formdata['topic']}

    ### Goal:
    {formdata['goal']}

    ### Background:
    {formdata['background']}
    """
    return llm_request(prompt)


def generate_course(maintopic: str, subtopics: dict, subtopic: str):
    COURSE_PROMPT = """
        ## Course Subtopic Content Creation

        ## Introduction  
        - **YOU ARE** an **EXPERT EDUCATIONAL CONTENT CREATOR** specializing in developing comprehensive and detailed course materials focused on specific subtopics.  
        (Context: "Your expertise ensures clarity, depth, and actionable insights, making each course segment valuable for learners.")  

        ## Task Description  
        - **YOUR TASK IS** to **WRITE A DETAILED COURSE SECTION** on the provided **specific subtopic** from the given course outline.  
        (Context: "Each section must stand alone, offering clear explanations, relevant examples, and practical exercises for immediate application.")  

        ## Action Steps  

        ### 1. Introduction to the Subtopic  
        - **PROVIDE** a brief introduction (1-3 sentences) explaining the essence of the subtopic.  
        (Context: "This sets the stage for the learner to understand the importance and relevance of the subtopic.")  

        ### 2. Detailed Explanation  
        - **DELIVER** an in-depth explanation of the subtopic.  
        - **INCLUDE** key concepts, definitions, and principles necessary for comprehension.  
        - **ILLUSTRATE** complex ideas with clear examples.  
        (Context: "Precision and depth in explanations ensure learners can grasp even the most challenging aspects.")  

        ### 3. Practical Exercise  
        - **DESIGN** an exercise or activity that allows learners to apply their knowledge.  
        - **ENSURE** the exercise is actionable, relevant, and self-contained.  
        (Context: "Practical exercises reinforce theoretical knowledge and improve retention.")  

        ## Goals and Constraints  
        - **FOCUS** exclusively on the **provided subtopic**—do not reference or discuss other subtopics from the course outline.  
        - **ENSURE** all information is accurate and up-to-date.  
        - **FORMAT** the response in **Markdown** for clarity and structure.  
        - **AVOID** engaging in conversations or addressing the user directly—present content as if it were published on an educational platform.  
        (Context: "Clear boundaries ensure focus, professionalism, and a seamless learning experience.")  

        ## Output Format  
        - **SECTION TITLE:** [Subtopic Title]  
        - **INTRODUCTION:** Brief overview (1-3 sentences)  
        - **MAIN CONTENT:** In-depth explanation with examples  
        - **EXERCISE:** Practical activity for knowledge application  
        - **ENSURE:** a pretty but simplistic Markdown format so it is nice to read.
        - **ENSURE:** that headings are in the correct order and start with a h1 heading.

        ## IMPORTANT  
        - "Your precise and focused approach will make this subtopic a cornerstone of the course."  
        - "Accuracy and clarity are key to learner success—every detail matters!"

        ## User Input:
    """

    prompt = f"""
        {COURSE_PROMPT}
        ### Maintopic:
        {maintopic}

        ### Subtopics:
        {subtopics}

        ### Subtopic:
        {subtopic}
    """

    course = llm_request(prompt)
    return {
        "subtopic": subtopic,
        "content": course
    }


@app.post("/generate/course")
def generate(formdata: dict):
    try:
        subtopics = json.loads(generate_subtopics(formdata))
        results = []
        for subtopic in subtopics['subtopics']:
            results.append(generate_course(formdata['topic'], subtopics, subtopic))

        return results
    except json.JSONDecodeError:
        return {"error": "Invalid response from LLM"}
