FROM python:3.12-alpine
WORKDIR /app
COPY doh_server.py /app/
EXPOSE 8053
ENV PYTHONUNBUFFERED=1
CMD ["python3", "doh_server.py", "8053"]
