'use client';

import React, { useState } from 'react';
import { Upload, ChevronDown, Check } from 'lucide-react';
import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function InterviewSetupPage() {
  const [interviewType, setInterviewType] = useState('Behavioral');
  const [role, setRole] = useState('');
  const [techStack, setTechStack] = useState('');
  const [amount, setAmount] = useState('1 question');
  const [level, setLevel] = useState('');
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isAmountOpen, setIsAmountOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const fileRef = useRef(null);

    useEffect(() => {
    fetch("/api/profile/image")
        .then((res) => res.json())
        .then((data) => setProfile(data.imageUrl));
    }, []);

    // const openFile = () => fileRef.current?.click();

    const uploadImage = async (file) => {
    const form = new FormData();
    form.append("file", file);

    await fetch("/api/profile/image", {
        method: "POST",
        body: form,
    });

    const res = await fetch("/api/profile/image");
    const data = await res.json();
    setProfile(data.imageUrl);
    };

    const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    };

    const router = useRouter();

    const handleSubmit = async(e) => {
    e.preventDefault();

    // Validation
    if (!interviewType) {
        toast.error("Please select interview type");
        return;
    }

    if (!role.trim()) {
        toast.error("Please enter role");
        return;
    }

    if (!techStack.trim()) {
        toast.error("Please enter tech stack");
        return;
    }

    if (!amount) {
        toast.error("Please select interview amount");
        return;
    }

    if (!level) {
        toast.error("Please select interview level");
        return;
    }
    // if (!profile) {
    //     toast.error("Please upload profile picture");
    //     return;
    // }

    // Success
    
    console.log(interviewType, role, techStack, amount, level);
    
    const res = await fetch("/api/ai-interview/interview",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: interviewType,
        role,
        level,
        techstack: techStack,
        amount: parseInt(amount),
      }),
    });
    
    const data = await res.json();   // ⭐ add this
    console.log(data);
    toast.success("Interview setup successful!!!");

    // Navigate to next page
    router.push('/ai-interview/interviewRoom');   // change route if needed
    };


  return (
    <div className="min-h-screen  text-white flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md rounded-2xl border  p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" /> */}

        {/* Header */}
        <div className="mb-8 relative z-10">
          <div className="flex items-center gap-2 mb-6">
             {/* Logo Placeholder */}
            <div className="w-6 h-8 rounded-lg  justify-center">
              <span>
                <img src="/favicon.ico" alt="logo" />
              </span>
            </div>
            <span className="text-xl font-semibold text-white">AI MOCK</span>
          </div>
          
          <h1 className="text-l font-bold mb-2">Starting Your Interview</h1>
          <p className="text-zinc-400 text-sm">
            Customize your mock interview to suit your needs.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

          
          {/* Interview Type */}
          <div className="relative">
            <label className="block text-sm text-zinc-300 mb-2">
              What type of interview would you like to practice?
            </label>
            <button
              type="button"
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className="w-full bg-[#18181b] border border-zinc-700/50 rounded-xl px-4 py-3.5 text-left flex items-center justify-between hover:border-zinc-600 transition-colors"
            >
              <span className="text-zinc-100">{interviewType}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isTypeOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#18181b] border border-zinc-700 rounded-xl overflow-hidden shadow-xl z-20">
                {['Technical', 'Behavioral', 'Both'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setInterviewType(type); setIsTypeOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center justify-between"
                  >
                    {type}
                    {interviewType === type && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              What role are you focusing on?
            </label>
            <input
              type="text"
              placeholder="Select your role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-700/50 rounded-xl px-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white-500/50 transition-all"
            />
          </div>


          {/* Level */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Which level are you at? (e.g. Beginner, Intermediate, Senior)
            </label>
            <input
              type="text"
              placeholder="Select your preferred level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-700/50 rounded-xl px-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white-500/50 transition-all"
            />
          </div> 

          {/* Tech Stack */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Which tech stack would you like to focus on?
            </label>
            <input
              type="text"
              placeholder="Select your preferred tech stack"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-700/50 rounded-xl px-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white-500/50 transition-all"
            />
          </div>  

          {/* amount */}
          <div className="relative">
            <label className="block text-sm text-zinc-300 mb-2">
              How many questions would you like the interview to be?
            </label>
            <button
              type="button"
              onClick={() => setIsAmountOpen(!isAmountOpen)}
              className="w-full bg-[#18181b] border border-zinc-700/50 rounded-xl px-4 py-3.5 text-left flex items-center justify-between hover:border-zinc-600 transition-colors"
            >
              <span className="text-zinc-100">{amount}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isAmountOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAmountOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#18181b] border border-zinc-700 rounded-xl overflow-hidden shadow-xl z-20">
                {['1 question','2 questions', '5 questions', '10 questions'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => { setAmount(time); setIsAmountOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center justify-between"
                  >
                    {time}
                    {amount === time && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
                Profile picture
            </label>

            <div
                className="w-full bg-[#18181b] border border-zinc-700/50 rounded-xl px-4 py-3.5 flex items-center justify-center cursor-pointer hover:border-zinc-600 transition-colors group"
            >
                {profile ? (
                <img
                    src={profile}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="profile"
                />
                ) : (
                <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="text-sm">Upload an image</span>
                </div>
                )}

                <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
                />
            </div>
            </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white  hover:bg-white/80 text-sm text-black font-semibold rounded-full py-4 transition-all transform active:scale-[0.98] mt-4"
          >
            Start Interview
          </button>

        </form>
      </div>
    </div>
  );
}
