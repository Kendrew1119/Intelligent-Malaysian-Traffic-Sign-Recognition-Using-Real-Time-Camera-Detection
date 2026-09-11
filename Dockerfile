FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update \
    && apt-get install --yes --no-install-recommends libgl1 libglib2.0-0 libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-web.txt ./
RUN python -m pip install --upgrade pip \
    && python -m pip install -r requirements-web.txt

COPY webapp/ ./webapp/
COPY models/model_manifest.json ./models/model_manifest.json
COPY models/best_openvino_model/ ./models/best_openvino_model/

EXPOSE 10000

CMD ["sh", "-c", "python -m uvicorn webapp.main:app --host 0.0.0.0 --port ${PORT:-10000} --workers 1"]
