import OnboardingForm from "@/components/OnboardingForm";

const page = async () => {
  return (
    <div className="container max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Complete your profile</h1>
        <OnboardingForm 
            userEmail=""
            firstName=""
            lastName=""
        />
    </div>
  )
}

export default page