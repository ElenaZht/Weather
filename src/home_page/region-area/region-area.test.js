import React from 'react';
import {render, screen} from '@testing-library/react';
import RegionArea from './region-area';

describe("Region area component", () => {
    it("renders", () => {
        let prop = {regionName: "Jerusalim", date: '12:05 21 Jun 2022'};
        render(<RegionArea region={prop}/>);
        expect(document.body);
        expect(document.getElementsByClassName("regionName")[0]);
        expect(document.getElementsByClassName("regionTimeDate")[0]);
    });
    it("renders without region", () => {
        render(<RegionArea region={{}}/>);
        expect(document.body);
        expect(screen.getByText('Please, choose region!'));
        expect(document.getElementsByClassName("myBtn"));
    })
});
