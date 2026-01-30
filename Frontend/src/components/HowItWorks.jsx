import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Take AI Assessment",
      description: "Complete our smart assessment to evaluate your current knowledge level and learning style",
      icon: "🎯",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      shadowColor: "hover:shadow-blue-200",
      delay: "100"
    },
    {
      number: "02",
      title: "Get Personalized Plan",
      description: "Receive AI-generated learning path with curated resources and milestones",
      icon: "🧠",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      shadowColor: "hover:shadow-purple-200",
      delay: "200"
    },
    {
      number: "03", 
      title: "Learn & Practice",
      description: "Engage with interactive content, quizzes, and projects with real-time feedback",
      icon: "📚",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      shadowColor: "hover:shadow-green-200",
      delay: "300"
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor improvement with detailed analytics, badges, and certification",
      icon: "📈",
      color: "bg-gradient-to-r from-amber-500 to-amber-600",
      shadowColor: "hover:shadow-amber-200",
      delay: "400"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with animation */}
        <div className="text-center mb-16 transform transition-all duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 mb-6">
            {/* <span className="text-blue-600 text-sm font-medium">🚀 Smart Learning Platform</span> */}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fadeInUp">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient">AI LearnPro</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp delay-100">
            Four simple steps to master any topic with AI-powered learning
          </p>
        </div>

        {/* Steps Grid with hover animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group animate-fadeInUp"
              style={{ animationDelay: `${step.delay}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              
              {/* Main card */}
              <div className={`
                relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 
                transform transition-all duration-500 ease-out
                hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl ${step.shadowColor}
                group-hover:border-transparent
              `}>
                {/* Number Badge with pulse animation */}
                <div className={`
                  inline-flex items-center justify-center w-14 h-14 rounded-full 
                  ${step.color} text-white text-xl font-bold mb-6 
                  transform transition-transform duration-500 group-hover:scale-110
                  shadow-lg group-hover:shadow-xl
                `}>
                  {step.number}
                </div>
                
                {/* Icon with bounce animation */}
                <div className="text-4xl mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 transform transition-all duration-300 group-hover:text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed transform transition-all duration-500 group-hover:text-gray-700">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Process with animated arrows */}
        <div className="mt-20 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-200 transform transition-all duration-500 hover:shadow-2xl hover:border-blue-100">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-fadeInUp">
            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Learning Journey</span> Today
          </h3>
          
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 mb-8">
            {[
              { number: 1, color: "bg-blue-100", textColor: "text-blue-600", title: "Sign Up", desc: "Create your free account" },
              { number: 2, color: "bg-purple-100", textColor: "text-purple-600", title: "Take Assessment", desc: "5-minute AI assessment" },
              { number: 3, color: "bg-green-100", textColor: "text-green-600", title: "Start Learning", desc: "Begin your AI-powered journey" }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="group relative animate-fadeInUp" style={{ animationDelay: `${(index + 1) * 200}ms` }}>
                  {/* Step circle */}
                  <div className={`
                    w-20 h-20 rounded-full ${item.color} flex items-center justify-center 
                    ${item.textColor} text-2xl font-bold mb-4 mx-auto
                    transform transition-all duration-500 
                    group-hover:scale-110 group-hover:shadow-lg
                    relative z-10
                  `}>
                    {item.number}
                    {/* Pulse effect */}
                    <div className={`absolute inset-0 ${item.color.replace('100', '200')} rounded-full animate-ping opacity-20`} />
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-2 text-center transform transition-all duration-300 group-hover:text-gray-800">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm text-center transform transition-all duration-500 group-hover:text-gray-700">
                    {item.desc}
                  </p>
                </div>
                
                {/* Animated arrow between steps */}
                {index < 2 && (
                  <div className="relative hidden md:block">
                    <div className="text-blue-400 text-3xl font-bold transform transition-all duration-500 group-hover:scale-125 animate-slideInRight">
                      →
                    </div>
                    {/* Moving dot animation */}
                    <div className="absolute top-1/2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform -translate-y-1/2 animate-dash" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Additional Information Section (replacing the button) */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-blue-600 mb-2">100% Free</div>
                <p className="text-gray-600 text-sm">No hidden charges, start learning immediately</p>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-purple-600 mb-2">Instant Access</div>
                <p className="text-gray-600 text-sm">Get started right after signing up</p>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-green-600 mb-2">Unlimited Learning</div>
                <p className="text-gray-600 text-sm">Access all courses and features</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;