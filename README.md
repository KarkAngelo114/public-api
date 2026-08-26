# Welcome 👋

This repo is my collection of APIs that can be use for any projects. I built this to improve my backend development skills, and at the same time to prove that my [Neurex](https://github.com/KarkAngelo114/Neurex) library can be use in production setups. So probably, this project is mostly just doing inference. No data is being stored here as I've set this up with no database configurations. The available public APIs are listed below.

_Note: All APIs are rate-limited. So please use responsibly._

Endpoint Name | Method | Description
--- | :---: | :---: |
`/classify-text` | `POST` | Classifies text input as "Ham" or "Spam". Perfect for detecting and filtering messages in a messaging app |


## API Reference

#### 1. Ham vs Spam
**endpoint:** `POST https://api-collections-bbo8.onrender.com/public-api/v1/classify-text`

**resquest body:**
```json
{
    "textInput": "Your text input here" 
}
```

**response:**
```json
{
   "rawSore": [ 0.9987993836402893 ],
   "predictedClass": "SPAM",
   "inferenceDuration": "Took 11.6674ms"
}
```