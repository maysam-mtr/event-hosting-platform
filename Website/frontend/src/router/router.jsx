import {createBrowserRouter} from "react-router-dom";
import DefaultRoute from "../middlewares/DefaultRoute";
import RoleProtectedRoute from "../middlewares/RoleProtectedRoute";
import LayoutHost from "../layouts/LayoutHost";
import LayoutUser from "../layouts/LayoutUser";
import LayoutDefault from "../layouts/LayoutDefault";
import LandingPage from "../Pages/LandingPage/LandingPage";
import SignUpPage from "../Pages/SignUpPage/SignUpPage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import LayoutSimplified from "../layouts/LayoutSimplified";
import PricingPage from "../Pages/PricingPage/PricingPage";
import ContactUsPage from "../Pages/ContactUsPage/ContactUsPage";
import HomePage from "../Pages/UserPortal/HomePage/HomePage";
import SettingsPage from "../Pages/UserPortal/SettingsPage/SettingsPage";
import HostHomePage from "../Pages/HostPortal/HostHomePage/HostHomePage";
import MyEventsPage from "../Pages/HostPortal/MyEventsPage/MyEventsPage";
import SettingsHostPage from "../Pages/HostPortal/SettingsHostPage/SettingsHostPage";
import ProtectedRoute from "../middlewares/ProtectedRoute";
import EventDetailsPage from "../Pages/EventDetailsPage/EventDetailsPage";
import EventAccessRoute from "../middlewares/EventAccessRoute";
import EventGameSpace from "../Pages/EventGameSpace/EventGameSpace";
import ExploreEventsPage from "../Pages/UserPortal/ExploreEventsPage/ExploreEventsPage";

export const Router = createBrowserRouter([
    {
        path : "/index",
        element : <LayoutDefault/>,
        children: [
            {
                path: "",
                element: <LandingPage/>
            },
            {
                path: 'pricing',
                element: <PricingPage/>
            },
            {
                path: 'contact_us',
                element: <ContactUsPage/>
            }
        ]
    },
    {
        path:'/',
        element: <LayoutSimplified/>,
        children: [
            {
                index: true,
                element : <DefaultRoute />
            },
            {
                path : "signup",
                element: <SignUpPage />,
            },
            {
                path : "login",
                element: <LoginPage />,
            },
            {
                path : "errors",
                element : <ErrorPage  />,
            },
            {
                path : "*",
                element : <ErrorPage errorCode={"404"} errorTitle={"Page Not Found."} errorMessage={"The page you are looking for does not exist, try looking somewhere else ?"}/>,
            }
        ]
    },
    { 
        path : "/host",
        element : <RoleProtectedRoute requiredRole={"host"} />,
        children : [
            {
                element : <LayoutHost/>,
                children: [
                    {
                        path: '',
                        element: <HostHomePage/>,
                    },
                    {
                        path: 'my-events',
                        element: <MyEventsPage/>
                    },
                    {
                        path: 'settings',
                        element: <SettingsHostPage/>
                    }
                ]
            },
        ]
    },  
    { 
        path : "/user",
        element : <RoleProtectedRoute requiredRole={"user"} />,
        children : [
            {
                element : <LayoutUser/>,
                children: [
                    {
                        path: '',
                        element: <HomePage/>,
                    },
                    {
                        path: 'explore',
                        element: <ExploreEventsPage/>
                    },
                    {
                        path: 'settings',
                        element: <SettingsPage/>
                    }
                ]
            },
        ]
    }, 
    {
        path: '/event',
        element: <ProtectedRoute/>,
        children:[
            {
                element: <LayoutSimplified/>,
                children: [
                    {
                        path: 'details/:eventId',
                        element: <EventDetailsPage/>
                    },
                    {
                        element: <EventAccessRoute/>,
                        children: [
                            {
                                path: 'space',
                                element: <EventGameSpace/>
                            }
                        ]
                    }
                ]
            }
        ]
    }
])