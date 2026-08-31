FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# System libraries required by OpenCV / MediaPipe
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libxcb1 \
        libx11-6 \
        libglib2.0-0 \
        libgl1 \
        libegl1 \
        libgles2 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY scripts ./scripts
COPY models ./models
COPY ml ./ml
COPY alembic ./alembic
COPY alembic.ini .

RUN mkdir -p uploads/videos

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]