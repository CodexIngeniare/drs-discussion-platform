# Koristi Python 3.9 kao baznu sliku
FROM python:3.9-slim

# Postavi radni direktorijum u kontejneru
WORKDIR /app

# Instaliraj potrebne sistemske pakete (build-essential, libmariadb-dev, pkg-config)
RUN apt-get update && apt-get install -y \
    build-essential \
    libmariadb-dev \
    pkg-config \
    && apt-get clean

# Kopiraj Pipfile i Pipfile.lock u radni direktorijum
COPY Pipfile Pipfile.lock /app/

# Instaliraj Pipenv i sve zavisnosti
RUN pip install pipenv && pipenv install --deploy --ignore-pipfile

# Kopiraj ceo projekat u radni direktorijum
COPY . /app/

# Izloži port 5000
EXPOSE 5000

# Postavi environment varijable za Flask
ENV FLASK_APP=run.py
ENV FLASK_ENV=development

# Pokreni aplikaciju koristeći Pipenv
CMD ["pipenv", "run", "flask", "run", "--host=0.0.0.0"]
