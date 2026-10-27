FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80 443 8053

ENV SERVER_IP=13.229.210.222
ENV UPSTREAM_DNS=1.1.1.1
ENV UPSTREAM_PORT=53
ENV HTTPS_PORT=443
ENV HTTP_PORT=80

CMD ["python", "server.py"]
