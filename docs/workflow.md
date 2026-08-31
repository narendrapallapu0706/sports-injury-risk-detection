# System Workflow

## 1. Overview

The Sports Injury Risk Detection Platform is designed to process athlete movement videos and provide an injury-risk assessment.

The complete system will connect the frontend, backend, database, video-processing pipeline, and machine learning components.

---

## 2. High-Level Workflow

```text
                    Athlete / Coach
                           |
                           v
                      Frontend
                           |
                           v
                  FastAPI Backend
                           |
             +-------------+-------------+
             |                           |
             v                           v
       Authentication              Video Management
             |                           |
             |                    +------+------+
             |                    |             |
             v                    v             v
           JWT              Video Storage   PostgreSQL
             |                    |
             +---------+----------+
                       |
                       v
                Video Processing
                       |
                       v
                 Pose Estimation
                       |
                       v
              Body Keypoints
                       |
                       v
          Biomechanical Features
                       |
                       v
               ML Prediction
                       |
                       v
             Injury Risk Result
                       |
                       v
                  PostgreSQL
                       |
                       v
                    Frontend
                       |
                       v
              Athlete / Coach  