import React from 'react';
import TripPlannerForm from "../../components/TripPlannerForm";
import { FormData } from "../../types/form";
import { plannerFormConfig } from "../../data/plannerFormConfig";
import { useRouter } from 'next/router';

const Planner = () => {
    const router = useRouter();
    
    const handleFormSubmit = (formData: FormData) => {
        console.log('Form submitted:', formData);
        router.push('/map'); 
        // Here you can handle the form submission
        // For example, send data to an API or navigate to results page
    };

    return (
        <div className="bg-gradient-to-br from-green-100 to-green-200 min-h-screen">
            <TripPlannerForm 
                config={plannerFormConfig}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};

export default Planner;