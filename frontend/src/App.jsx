// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import { useState } from 'react';
// import IntroScreen from './components/introScreen';
// import RoleSelection from './components/roleSelection';
// import "./App.css"

// const App = () => {
//   const [currentScreen, setCurrentScreen] = useState(0);
//   const [showRoleSelection, setShowRoleSelection] = useState(false);

//   const introScreens = [
//     {
//       title: "Find Local Services Instantly",
//       description: "Connect with skilled professionals in your neighborhood with just a few taps. No more endless searching or unreliable providers!",
//       image: "🔧",
//     },
//     {
//       title: "Get More Customers Daily",
//       description: "Service providers: Never miss work opportunities again. We connect you directly with customers in your area who need your skills.",
//       image: "👨‍🔧",
//     },
//     {
//       title: "Verified & Trusted Professionals",
//       description: "All service providers are personally verified by our team. Quality service guaranteed or your money back!",
//       image: "✅",
//     }
//   ];

//   const handleNext = () => {
//     if (currentScreen < introScreens.length - 1) {
//       setCurrentScreen(currentScreen + 1);
//     } else {
//       setShowRoleSelection(true);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentScreen > 0) {
//       setCurrentScreen(currentScreen - 1);
//     }
//   };

//   const handleSkip = () => {
//     setShowRoleSelection(true);
//   };

//   if (showRoleSelection) {
//     return <RoleSelection />;
//   }

//   return (
//     <IntroScreen
//       screenData={introScreens[currentScreen]}
//       currentScreen={currentScreen}
//       totalScreens={introScreens.length}
//       onNext={handleNext}
//       onPrevious={handlePrevious}
//       onSkip={handleSkip}
//     />
//   );
// };

// export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import IntroScreen from "./components/introScreen";
import RoleSelection from "./components/roleSelection";
import WorkerRegistration from "./components/workerRegistration";
import WorkerLogin from "./components/workerLogin";
import CustomerRegistration from "./components/customerRegistration";
import CustomerLogin from "./components/customerLogin";
import CustomerScreen from "./components/customerScreen";
import CustomerProfile from "./components/customerProfile";
import CustomerBookings from "./components/customerBookings";
import WorkerDashboard from "./components/workerDashboard";
import "./App.css";

// Main App Component with Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingFlow />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/worker-registration" element={<WorkerRegistration />} />
        <Route path="/worker-login" element={<WorkerLogin />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard/>} />
        <Route
          path="/customer-registration"
          element={<CustomerRegistration />}
        />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-screen" element={<CustomerScreen />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/customer-bookings" element={<CustomerBookings />} />
      </Routes>
    </Router>
  );
}

// Onboarding Flow Component (for intro screens)
const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);

  const introScreens = [
    {
      title: "Find Local Services Instantly",
      description:
        "Connect with skilled professionals in your neighborhood with just a few taps. No more endless searching or unreliable providers!",
      image: "🔧",
    },
    {
      title: "Get More Customers Daily",
      description:
        "Service providers: Never miss work opportunities again. We connect you directly with customers in your area who need your skills.",
      image: "👨‍🔧",
    },
    {
      title: "Verified & Trusted Professionals",
      description:
        "All service providers are personally verified by our team. Quality service guaranteed or your money back!",
      image: "✅",
    },
  ];

  const handleNext = () => {
    if (currentScreen < introScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      navigate("/role-selection");
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSkip = () => {
    navigate("/role-selection");
  };

  return (
    <IntroScreen
      screenData={introScreens[currentScreen]}
      currentScreen={currentScreen}
      totalScreens={introScreens.length}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSkip={handleSkip}
    />
  );
};

export default App;
