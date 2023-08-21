import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import Header from './header';
import {waitFor} from "@testing-library/dom";
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = value;
    }

    removeItem(key) {
        delete this.store[key];
    }
}

global.localStorage = new LocalStorageMock();
global.window = window || {};
window.matchMedia = () =>  {return {matches: false}};
const userObj = {
    "givenName" : "Ben",
    "familyName" : "Gurion",
    "name" : "Ben Gurion",
    "email" : "bengurion@gmail.com",
    "imageUrl" : "../../assets/ben.jpg"
};

describe("Header", () => {
        it("Header renders", () => {
            render(<Header/>);
            expect(document.body);
            expect(document.getElementsByClassName("logo"))
        });
        it('if not logged in only google btn is shown',  () => {
            localStorage.clear();
            const {getByTestId} = render(<Header/>);
            const logBtn = getByTestId("google-button");
            const userBtn = getByTestId("user-button");
            expect(logBtn).not.toHaveClass("collapse");
            expect(userBtn).toHaveClass("collapse");
        });
        it('if logged in only user btn is shown', () => {
            localStorage.setItem('user', JSON.stringify(userObj));
            const {getByTestId} = render(<Header/>);
            const logBtn = getByTestId("google-button");
            const userBtn = getByTestId("user-button");
            const userText = userBtn.firstChild;
            expect(logBtn).toHaveClass("collapse");
            expect(userBtn).not.toHaveClass("collapse");
            expect(userText).toHaveTextContent("BG");
        });
        it('burger click open menu', async () => {
            const {getByTestId} = render(<Header/>);
            const burger = getByTestId("burger-button");
            const menu = getByTestId("menu-list");
            expect(menu).toHaveClass("skipping");
            expect(burger).not.toHaveClass("collapse");
            fireEvent.click(burger);
            expect(burger).toHaveClass("collapse");
            expect(menu).not.toHaveClass("skipping");
        });
        it('user btn click open modal, modal renders user info', async () => {
            localStorage.setItem('user', JSON.stringify(userObj));
            const {getByTestId} = render(<Header/>);
            const userBtn = getByTestId("user-button");
            fireEvent.click(userBtn);
            await waitFor(async () =>{
                const modal = getByTestId("user-profile-modal");
                expect(modal).toBeInTheDocument();
                const userPhoto = getByTestId("user-photo");
                const userName = getByTestId("user-name");
                const userEmail = getByTestId("user-email");
                const logoutBtn = getByTestId("logout");
                const closeBtn = getByTestId("close-menu-header");

                expect(userPhoto).toHaveStyle("background: url(../../assets/ben.jpg)");
                expect(userName).toHaveTextContent("Ben Gurion");
                expect(userEmail).toHaveTextContent("bengurion@gmail.com");
                expect(logoutBtn).toHaveTextContent("Log out");
                expect(closeBtn).toHaveTextContent("Close");
            })


        });
        it('modal btn logout calls logout function', async () => {
            localStorage.setItem('user', JSON.stringify(userObj));
            const {getByTestId} = render(<Header/>);
            const userBtn = getByTestId("user-button");
            fireEvent.click(userBtn);
            await waitFor(async () =>{
                const modal = screen.getByTestId("user-profile-modal");
                expect(modal).toBeInTheDocument();
                const logoutBtn = screen.getByTestId("logout");
                fireEvent.click(logoutBtn);
                expect(localStorage.user).toBeFalsy();
            })
        });
        it("modal btn close closes modal", async () => {
            localStorage.setItem('user', JSON.stringify(userObj));
            const {getByTestId} = render(<Header/>);
            const userBtn = getByTestId("user-button");
            fireEvent.click(userBtn);
            await waitFor(async () =>{
                const modal = screen.getByTestId("user-profile-modal");
                expect(modal).toBeInTheDocument();
                const closeBtn = screen.getByTestId("close-menu-header");
                fireEvent.click(closeBtn);
                expect(modal).not.toHaveClass("active");
                expect(localStorage.user).toBeTruthy();
            });

        })
    }
);
