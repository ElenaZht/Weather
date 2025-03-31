import React from 'react';
import {render, screen} from '@testing-library/react';
import WeatherComponent from './weather-component';
import '@testing-library/jest-dom';
import axios from 'axios';
import {waitFor} from "@testing-library/dom";
import WeatherService from '../../services/weather-service.js';


jest.mock('axios');
jest.setTimeout(30000);
const weatherService = WeatherService.getInstance(2000);

describe('Weather component', () => {
    it('works without data', async () => {
        let testRegion = {
            regionName: 'Jerusalem',
            timeZone: 'Asia/Jerusalem'
        };
        axios.get.mockResolvedValue({});
        render(<WeatherComponent region={testRegion}/>);
        expect(await document.getElementsByClassName('wrapper')[0].firstChild).toHaveClass('spinner');
        await new Promise((r) => setTimeout(r, 5000));
        expect(await screen.getByText(/Please, try again later/i)).toBeTruthy();
    });
    it('works with data', async() => {
        let testRegion = {
            regionName: 'Jerusalem',
            timeZone: 'Asia/Jerusalem'
        };
        axios.get.mockResolvedValue({"data" :{"coord":{"lon":35.2163,"lat":31.769},
                "weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],
                "base":"stations","main":{"temp":10.39,"feels_like":9.44,"temp_min":7.35,"temp_max":10.4,
                    "pressure":1011,"humidity":75},"visibility":10000,"wind":{"speed":1.13,"deg":163,"gust":1.17},
                "clouds":{"all":16},"dt":1644345660,
                "sys":{"type":2,"id":2004982,"country":"IL","sunrise":1644294453,"sunset":1644333548},
                "timezone":7200,"id":281184,"name":"Jerusalem","cod":200}});

        render(<WeatherComponent region={testRegion}/>);
        expect(document.body);
        await new Promise((r) => setTimeout(r, 5000));
        expect(await screen.findByTestId('digit')).toBeInTheDocument();
        expect(await document.getElementsByClassName('text')[0].firstChild).toBeTruthy();
        expect(await document.getElementsByClassName('sunrise')[0].getElementsByTagName('div')[1]).toBeTruthy();
        expect(await document.getElementsByClassName('sunset')[0].getElementsByTagName('div')[1]).toBeTruthy();
        expect(await document.getElementsByClassName('wind')[0].getElementsByTagName('div')[1]).not.toBe(' m/s');
        expect(await document.getElementsByClassName('hum')[0].getElementsByTagName('div')[1]).not.toBe(' %');
        expect(await document.getElementsByClassName('picture')[0]).not.toHaveStyle("background: none");
        expect(await document.getElementsByClassName('advice')[0].firstChild).toBeTruthy();

    });

    it('weather updating when new data comes', async() => {
        let testRegion = {
            regionName: 'Jerusalem',
            timeZone: 'Asia/Jerusalem'
        };
        axios.get.mockResolvedValue({"data" :{"coord":{"lon":35.2163,"lat":31.769},
                "weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],
                "base":"stations","main":{"temp":10.39,"feels_like":9.44,"temp_min":7.35,"temp_max":10.4,
                    "pressure":1011,"humidity":75},"visibility":10000,"wind":{"speed":1.13,"deg":163,"gust":1.17},
                "clouds":{"all":16},"dt":1644345660,
                "sys":{"type":2,"id":2004982,"country":"IL","sunrise":1644294453,"sunset":1644333548},
                "timezone":7200,"id":281184,"name":"Jerusalem","cod":200}});
        render(<WeatherComponent region={testRegion}/>);
        await new Promise((r) => setTimeout(r, 5000));
        expect(await screen.getByText(/few clouds/i)).toBeInTheDocument();
            axios.get.mockResolvedValue({"data" :{"coord":{"lon":35.2163,"lat":31.769},
                    "weather":[{"id":801,"main":"Clouds","description":"clear sky","icon":"02n"}],
                    "base":"stations","main":{"temp":10.39,"feels_like":9.44,"temp_min":7.35,"temp_max":10.4,
                        "pressure":1011,"humidity":75},"visibility":10000,"wind":{"speed":1.13,"deg":163,"gust":1.17},
                    "clouds":{"all":16},"dt":1644345660,
                    "sys":{"type":2,"id":2004982,"country":"IL","sunrise":1644294453,"sunset":1644333548},
                    "timezone":7200,"id":281184,"name":"Jerusalem","cod":200}});
            jest.advanceTimersByTime(2000);
        await waitFor(() =>expect(screen.getByText(/clear sky/i)).toBeInTheDocument());
        screen.debug()


    });

});
