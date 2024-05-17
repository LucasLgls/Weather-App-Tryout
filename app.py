from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def weather():
    city = request.form['city']
    api_key = 'YOUR_API_KEY'
    weather_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric"
    response = requests.get(weather_url)
    weather_data = response.json()

    if weather_data['cod'] == '404':
        return render_template('index.html', error_msg='City not found.')
    
    # Prepare weather forecast data for display
    forecast_data = [
        {
            'date': data['dt_txt'],
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon']
        } for data in weather_data['list']
    ]

    return render_template('index.html', forecast_data=forecast_data)

if __name__ == '__main__':
    app.run(debug=True)
