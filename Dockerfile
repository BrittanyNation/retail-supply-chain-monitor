# syntax=docker/dockerfile:1
FROM python:3.11-alpine AS builder

WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-alpine
WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY ./app /app/app

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]