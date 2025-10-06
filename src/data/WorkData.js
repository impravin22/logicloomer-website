// work data

export const Work = [
    {
        id:1,
        name:"AI Sales Assistant System - Multi-Agent Architecture",
        description:"Designed and led comprehensive multi-agent AI system to assist ViewSonic sales teams with product information, competitor analysis, and sales support. Built end-to-end ML pipeline with intelligent agent coordination.",
        tags:["Multi-Agent Systems","LLMs","FastAPI","Vector Databases"],
        demo:"#",
        github:"#",
        expandedContent: "Led the development of a sophisticated multi-agent AI system for ViewSonic's sales teams. The system features specialized agents for product information, software features, competitor comparison, and general inquiries. Implemented agent coordination and routing to provide contextually relevant responses for sales scenarios. Built robust data collection pipeline from PostgreSQL, Qdrant databases, Dropbox, and SharePoint APIs. The system uses Qdrant vector database for semantic search capabilities and integrates Google Search API for real-time market intelligence. Deployed using openWebUI for intuitive sales team interaction."
    },
    {
        id:2,
        name:"Graph Neural Networks for Stroke Recognition",
        description:"Developed stroke-based sketch recognition achieving 92% accuracy using GNN architectures optimized for real-time inference on interactive flat panel whiteboards.",
        tags:["Graph Neural Networks","Real-time Processing","Computer Vision"],
        demo:"#",
        github:"#",
        expandedContent: "This cutting-edge project tackled the challenge of recognizing hand-drawn sketches in real-time on interactive flat panel whiteboards. I implemented a hybrid LSTM/GNN architecture that captured both temporal stroke data and spatial relationships between strokes. Key achievements include optimization techniques that reduced the model size by 60% while maintaining accuracy, and implementing real-time inference with a response time under 100ms. The system now recognizes over 100 different sketch shapes with 92% accuracy."
    },
    {
        id:3,
        name:"Large-Scale Object Detection",
        description:"Organized 500K+ image dataset and trained object detection models achieving mAP of 0.82 using PyTorch for comprehensive computer vision applications.",
        tags:["PyTorch","Object Detection","Computer Vision","Large-Scale Data"],
        demo:"#",
        github:"#",
        expandedContent: "This project involved organizing and processing a massive dataset of over 500,000 images for object detection training. I designed and implemented a comprehensive data pipeline that handled image preprocessing, annotation, and augmentation at scale. Using PyTorch, I developed custom object detection models that achieved an mAP of 0.82, representing significant improvements over baseline models. The system was optimized for both accuracy and inference speed, making it suitable for real-world deployment scenarios."
    },
    {
        id:4,
        name:"Model Distillation Pipeline",
        description:"Fine-tuned 600M parameter model achieving 2x speed improvement while maintaining accuracy through advanced knowledge distillation techniques.",
        tags:["Model Optimization","Knowledge Distillation","NLP"],
        demo:"#",
        github:"#",
        expandedContent: "This project focused on optimizing large language models through advanced knowledge distillation techniques. I fine-tuned a 600M parameter model that achieved 2x speed improvement while maintaining comparable accuracy to larger models. The system used innovative distillation strategies including teacher-student architectures, progressive knowledge transfer, and dynamic temperature scaling. The optimized model was deployed in production environments where inference speed was critical, significantly reducing computational costs while maintaining high-quality outputs."
    },
    {
        id:5,
        name:"Distributed Computing Infrastructure",
        description:"Set up Kubernetes clusters for multi-GPU training and deployed distributed ML workloads with advanced orchestration and resource management.",
        tags:["Kubernetes","Multi-GPU Computing","Distributed Systems"],
        demo:"#",
        github:"#",
        expandedContent: "Designed and implemented a comprehensive distributed computing infrastructure using Kubernetes for large-scale machine learning workloads. The system supports multi-GPU training across multiple nodes with advanced resource management and job scheduling. Implemented auto-scaling capabilities that dynamically allocate resources based on workload demands. The infrastructure handles data parallelism, model parallelism, and hybrid training strategies, enabling efficient training of large models on distributed hardware. This system significantly reduced training time for complex models while optimizing resource utilization."
    },
    {
        id:6,
        name:"Reinforcement Learning - Pose Classification",
        description:"Developed pose classification system achieving 80% real-time accuracy using reinforcement learning on edge devices for interactive applications.",
        tags:["Reinforcement Learning","Edge Deployment","Computer Vision"],
        demo:"#",
        github:"#",
        expandedContent: "This project focused on developing a real-time pose classification system using reinforcement learning techniques optimized for edge devices. The system processes human pose data and classifies different poses with 80% accuracy in real-time. I implemented custom RL algorithms that adapt to different user behaviors and environmental conditions. The system was specifically designed for resource-constrained edge devices, achieving efficient inference while maintaining high accuracy. This technology has applications in fitness tracking, gesture recognition, and interactive gaming systems."
    },
    {
        id:7,
        name:"Computer Vision with Heat Map Regression",
        description:"Implemented heat map-based detection achieving 85% accuracy using OpenVino C++ for high-performance computer vision applications.",
        tags:["Computer Vision","C++","OpenVino","Heat Map Regression"],
        demo:"#",
        github:"#",
        expandedContent: "Developed a sophisticated computer vision system using heat map regression techniques for object detection and localization. The system achieved 85% accuracy using OpenVino C++ optimization for high-performance inference. I implemented custom heat map generation algorithms that provide precise spatial information about detected objects. The system was optimized for real-time processing with minimal latency, making it suitable for applications requiring immediate response times. This approach provides more detailed spatial information compared to traditional bounding box detection methods."
    },
    {
        id:8,
        name:"Speech-to-Sign Language GAN",
        description:"Built speech-to-sign translation system integrating Whisper ASR with generative models for accessible communication technology.",
        tags:["Whisper ASR","Generative Models","Accessibility","GAN"],
        demo:"#",
        github:"#",
        expandedContent: "This innovative project combines speech recognition with generative models to create a comprehensive speech-to-sign language translation system. I integrated OpenAI's Whisper ASR for robust speech-to-text conversion and developed custom GAN architectures for generating realistic sign language gestures. The system processes natural speech and converts it into fluid, contextually appropriate sign language animations. This technology has significant potential for improving accessibility and communication between hearing and deaf communities."
    },
    {
        id:9,
        name:"Edge AI Optimization - License Plate Recognition",
        description:"Deployed license plate recognition using TensorRT optimization and CUDA acceleration at Neurelli, achieving high accuracy on edge devices.",
        tags:["TensorRT","CUDA","Edge Computing","Computer Vision"],
        demo:"#",
        github:"#",
        expandedContent: "At Neurelli, I developed an edge-computing solution for license plate recognition that operates effectively on limited hardware resources. The system uses TensorRT optimization and CUDA acceleration for maximum performance on edge devices. I implemented model pruning and quantization techniques that reduced model size by 85% while maintaining 98% accuracy in controlled environments and 92% accuracy in adverse weather conditions. The system processes video streams at 25fps on edge devices with just 2GB RAM, making it ideal for deployment in parking facilities and toll booths with limited connectivity."
    },
    {
        id:10,
        name:"Variational Autoencoder for Anomaly Detection",
        description:"Implemented Variational Autoencoder for LCD panel defect detection using PyTorch, significantly improving quality control processes.",
        tags:["Variational Autoencoder","Anomaly Detection","PyTorch","Manufacturing"],
        demo:"#",
        github:"#",
        expandedContent: "I engineered an unsupervised learning system at Neurelli using Variational Autoencoders to automate LCD panel quality control. The solution detects manufacturing defects without requiring labeled training data, which was crucial for identifying new and previously unseen defect types. The system processes high-resolution panel images and identifies pixel-level defects including scratches, dead pixels, backlight bleeding, and color inconsistencies. After deployment, the system reduced manual inspection time by 70% while increasing defect detection rates by 35%, resulting in significant cost savings and quality improvements for manufacturing clients."
    },
    {
        id:11,
        name:"Industrial ML Pipeline - Process Optimization",
        description:"Built end-to-end ML solution for casting process optimization achieving 85% prediction accuracy at Neurelli.",
        tags:["Machine Learning","Manufacturing","Process Optimization","Industrial AI"],
        demo:"#",
        github:"#",
        expandedContent: "This industrial project at Neurelli focused on improving precision in manufacturing processes using machine learning. I developed predictive models for metal casting processes that analyze real-time temperature, pressure, and material composition data to predict optimal cooling times and detect potential defects before they occur. The system uses advanced time-series analysis and feature engineering to identify patterns in manufacturing data. The solution improved manufacturing precision by 40% and reduced material waste by 25%, achieving an overall prediction accuracy of 85%."
    }
]
 