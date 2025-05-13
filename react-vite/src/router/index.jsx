import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import GetPin from '../components/GetPin';
import GetAllPins from '../components/GetAllPins/GetAllPins';
import CreatePin from '../components/CreatePin/CreatePin';
import EditPin from '../components/EditPin/EditPin';
import Layout from './Layout';
import HomePage from '../components/HomePage/HomePage';
import UserProfile from '../components/UserProfile';
import GetAllBoards from '../components/GetAllBoards';
import GetOneBoard from '../components/GetOneBoard';
import CreateBoard from '../components/CreateBoard';
import EditBoard from '../components/EditBoard';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "pin/:pinId",
        element: <GetPin />,
      },
      {
        path: "pin",
        element: <GetAllPins />,
      },
      {
        path: "pin-creation-tool",
        element: <CreatePin />
      },
      {
        path: "pin/:pinId/edit",
        element: <EditPin />
      },
      {
        path: "current-user",
        element: <UserProfile />,
      },
      {
        path: "boards",
        element: <GetAllBoards />
      },
      {
        path: "boards/:boardId",
        element: <GetOneBoard />
      },
      {
        path: "board-creation-tool",
        element: <CreateBoard />
      },
      {
        path: "boards/:boardId/edit",
        element: <EditBoard />
      },
      {
        path: "*",
        element: <h1 style={{margin:'240px, 40px', zIndex:'1000', position: 'absolute', top:'200px', left:'80px', color:'#ff2f00'}}>404 Not Found</h1>,
      }
    ],
  },
]);
