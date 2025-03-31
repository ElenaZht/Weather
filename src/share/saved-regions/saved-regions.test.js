import React from 'react';
import {render, screen} from '@testing-library/react';
import SavedRegions from './saved-regions';

global.window = window || {};

describe('Saved regions component', () => {
    window.matchMedia = () =>  {return {matches: false}};
    it('renders', () => {
        const saved = [{regionName: 'Minsk', date: '13:05 21 Jun 2022'},
            {regionName: 'Holon', date: '12:05 21 Jun 2022'},
            {regionName: 'Tel Aviv', date: '12:05 21 Jun 2022'},
            {regionName: 'Mogilev', date: '13:05 21 Jun 2022'},
            {regionName: 'Moscow', date: '13:05 21 Jun 2022'},
            {regionName: 'Kiev', date: '13:05 21 Jun 2022'}
            ];
        render(<SavedRegions regions={saved}/>);
        expect(document.body);
        expect(document.getElementsByClassName('card'));
        expect(document.getElementsByClassName('cardBtn'));
    });
    it('renders with no saved regions', () => {
        const saved = [];
        render(<SavedRegions regions={saved}/>);
        expect(document.body);
        expect(document.getElementsByClassName('cardBtn'));
    })
});

describe('Saved regions component mobile', () => {
    window.matchMedia = () =>  {return {matches: true}};
    it('renders', () => {
        const saved = [{regionName: 'Minsk', date: '13:05 21 Jun 2022'},
            {regionName: 'Holon', date: '12:05 21 Jun 2022'},
            {regionName: 'Tel Aviv', date: '12:05 21 Jun 2022'},
            {regionName: 'Mogilev', date: '13:05 21 Jun 2022'},
            {regionName: 'Moscow', date: '13:05 21 Jun 2022'},
            {regionName: 'Kiev', date: '13:05 21 Jun 2022'}
        ];
        render(<SavedRegions regions={saved}/>);
        expect(document.body);
        expect(document.getElementsByClassName('card'));
        expect(document.getElementsByClassName('cardBtn'));


    });
    it('renders with no saved regions mobile', () => {
        const saved = [];
        render(<SavedRegions regions={saved}/>);
        expect(document.body);
        expect(screen.getByText('No saved regions yet. Add?'));
        expect(document.getElementsByClassName('cardBtn'));

    })
});

