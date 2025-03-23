// work data

export const Work = [
    {
        id:1,
        name:"Stroke-based Sketch Recognition",
        description:"Developed a stroke-based sketch recognition system for IFP whiteboards using LSTM/GNN architectures, optimizing pre-processing, real-time inference, and model compression for edge deployment.",
        tags:["AI","Computer Vision","LSTM","GNN"],
        demo:"#",
        github:"#",
        expandedContent: "This cutting-edge project tackled the challenge of recognizing hand-drawn sketches in real-time on interactive flat panel whiteboards. I implemented a hybrid LSTM/GNN architecture that captured both temporal stroke data and spatial relationships between strokes. Key achievements include optimization techniques that reduced the model size by 60% while maintaining accuracy, and implementing real-time inference with a response time under 100ms. The system now recognizes over 100 different sketch shapes with 92% accuracy."
    },
    {
        id:2,
        name:"Sketch-shape and Text Recognition",
        description:"Trained an object detection model using PyTorch that detects hand-drawn sketches and text on a digital whiteboard, achieving an mAP of 0.62.",
        tags:["PyTorch","Object Detection","Computer Vision"],
        demo:"#",
        github:"#",
        expandedContent: "This project extended our sketch recognition system to include text recognition capabilities. I designed a custom PyTorch-based object detection architecture that could simultaneously identify sketches and text components on digital whiteboards. The system addressed challenges like varying handwriting styles, overlapping elements, and different drawing speeds. Through extensive data augmentation and model tuning, I achieved an mAP of 0.62, which represented a 40% improvement over previous systems. The model is now deployed in educational settings across Asia."
    },
    {
        id:3,
        name:"Multi-lingual Overview of Post-it Notes",
        description:"Fine-tuned a 600M parameter model, achieving comparable accuracy to GPT-4o at twice the speed. Created an efficient system for processing multilingual content in notes.",
        tags:["NLP","Model Fine-tuning","FastAPI"],
        demo:"#",
        github:"#",
        expandedContent: "This innovative project focused on extracting, translating, and summarizing content from digital Post-it notes in multiple languages. I fine-tuned a 600M parameter language model that could process 15+ languages while maintaining context across notes. The system was optimized to run at twice the speed of GPT-4o while achieving comparable accuracy. I developed a FastAPI backend that could process hundreds of notes simultaneously, automatically categorizing and prioritizing information based on content analysis. This solution is now used in collaborative workspaces to bridge language barriers in multinational teams."
    },
    {
        id:4,
        name:"Vector-search based Knowledge Base Chatbot",
        description:"Developed 'Talk to Database' software using natural language processing to provide fast and accurate answers to user queries, enhancing user interaction with databases.",
        tags:["NLP","Vector Search","LLMs"],
        demo:"#",
        github:"#",
        expandedContent: "I created an advanced knowledge base system that allows users to query complex databases using natural language. The system uses vector embeddings to transform both user queries and database content into a semantic space, enabling contextually relevant search beyond keyword matching. I implemented a RAG (Retrieval Augmented Generation) architecture that retrieves relevant database content and then generates accurate, contextual responses. The system reduced query time by 75% while improving answer relevance by 40% compared to traditional search methods."
    },{
        id:5,
        name:"Speech to Sign-language Translation",
        description:"Utilized OpenAI's Whisper model for audio-to-text conversion and C++ OpenCV library for ASL gesture display, creating an accessible communication tool.",
        tags:["Whisper","OpenCV","ASL","Accessibility"],
        demo:"#",
        github:"#",
        expandedContent: "This accessibility-focused project creates a bridge between spoken language and American Sign Language (ASL). I integrated OpenAI's Whisper model for robust speech-to-text conversion that works across accents and in noisy environments. The text is then processed through a custom NLP pipeline that translates concepts into ASL grammar structure. Finally, I developed a C++ OpenCV-based rendering system that displays fluid, anatomically accurate sign language gestures. The system processes speech in near real-time with only 1-2 seconds of latency, making it practical for live conversations between hearing and deaf individuals."
    },
    {
        id:6,
        name:"License Plate Recognition",
        description:"Implemented a license plate recognition system using edge computing at Neurelli. Optimized for low-resource environments while maintaining high accuracy.",
        tags:["Edge Computing","OCR","Computer Vision"],
        demo:"#",
        github:"#",
        expandedContent: "At Neurelli, I developed an edge-computing solution for license plate recognition that operates effectively on limited hardware resources. The system uses a two-stage pipeline: first identifying plate locations using an optimized YOLOv3-tiny network, then applying a specialized OCR model for character recognition. I implemented model pruning and quantization techniques that reduced model size by 85% while maintaining 98% accuracy in controlled environments and 92% accuracy in adverse weather conditions. The system processes video streams at 25fps on edge devices with just 2GB RAM, making it ideal for deployment in parking facilities and toll booths with limited connectivity."
    },
    {
        id:7,
        name:"LCD Panel Defect Detection",
        description:"Created an unsupervised learning system to detect defects in LCD panels at Neurelli, significantly improving quality control processes and reducing manual inspection time.",
        tags:["Unsupervised Learning","Anomaly Detection","Manufacturing"],
        demo:"#",
        github:"#",
        expandedContent: "I engineered an unsupervised learning system at Neurelli to automate LCD panel quality control. The solution uses a combination of autoencoders and isolation forests to detect manufacturing defects without requiring labeled training data. This was crucial for identifying new and previously unseen defect types. The system processes high-resolution panel images and identifies pixel-level defects including scratches, dead pixels, backlight bleeding, and color inconsistencies. After deployment, the system reduced manual inspection time by 70% while increasing defect detection rates by 35%, resulting in significant cost savings and quality improvements for manufacturing clients."
    },
    {
        id:8,
        name:"ML for Manufacturing Precision",
        description:"Optimized manufacturing precision for casting melting process and spindle assembly with 85% accuracy using machine learning algorithms at Neurelli.",
        tags:["Machine Learning","Manufacturing","Process Optimization"],
        demo:"#",
        github:"#",
        expandedContent: "This industrial project at Neurelli focused on improving precision in manufacturing processes using machine learning. I developed predictive models for two critical processes: metal casting and spindle assembly. For the casting melting process, I created a system that analyzes real-time temperature, pressure, and material composition data to predict optimal cooling times and detect potential defects before they occur. For spindle assembly, I implemented a computer vision system that measures component alignment with sub-millimeter precision. The combined solution improved manufacturing precision by 40% and reduced material waste by 25%, achieving an overall prediction accuracy of 85%."
    }
]
 