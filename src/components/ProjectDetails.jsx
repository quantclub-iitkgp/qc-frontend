import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiGithub, FiExternalLink } from "react-icons/fi";

// This would typically come from an API or larger data store
const projectsData = [
  {
    id: 1,
    title: "Algorithmic Trading Strategy",
    category: "Trading",
    description: "A machine learning-based strategy for high-frequency trading in equities market",
    fullDescription: "This project implements a sophisticated machine learning algorithm for high-frequency trading in equities markets. The system analyzes market microstructure, order flow, and technical indicators to identify short-term trading opportunities. Back-testing shows a Sharpe ratio of 2.3 with a 65% win rate across various market conditions.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
    technologies: ["Python", "TensorFlow", "Pandas", "API Integration"],
    github: "https://github.com/quantclub/algo-trading",
    demo: "https://demo.quantclub.io/algo-trading",
    team: ["Alex Wong", "Sarah Johnson", "Michael Chen"],
    screenshots: [
      "https://images.unsplash.com/photo-1535320903710-d993
    }
]