FROM python:3.9-slim

WORKDIR /app

COPY Pipfile Pipfile.lock /app/

RUN pip install pipenv && pipenv install --deploy --ignore-pipfile

COPY . /app/

EXPOSE 5000

ENV FLASK_APP=run.py
ENV FLASK_ENV=development

CMD ["pipenv", "run", "flask", "run", "--host=0.0.0.0"]