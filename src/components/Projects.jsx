import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const projectsData = [
  {
    id: 1,
    title: "Algorithmic Trading Strategy",
    category: "Trading",
    description: "A machine learning-based strategy for high-frequency trading in equities market",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
    technologies: ["Python", "TensorFlow", "Pandas", "API Integration"]
  },
  {
    id: 2,
    title: "Portfolio Optimization Tool",
    category: "Analysis",
    description: "Modern portfolio theory implementation with risk management metrics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    technologies: ["R", "Shiny", "Statistical Analysis"]
  },
  {
    id: 3,
    title: "Market Sentiment Analyzer",
    category: "NLP",
    description: "NLP-based tool analyzing news and social media for market sentiment prediction",
    image: "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?q=80&w=2070&auto=format&fit=crop",
    technologies: ["Python", "NLTK", "BERT", "Web Scraping"]
  },
  {
    id: 4,
    title: "Crypto Trading Bot",
    category: "Trading",
    description: "Automated trading system for cryptocurrency markets with backtesting capabilities",
    image: "https://images.unsplash.com/photo-1518544001401-3576bf64fcbf?q=80&w=2069&auto=format&fit=crop",
    technologies: ["Node.js", "WebSockets", "MongoDB"]
  },
  {
    id: 5,
    title: "Options Pricing Model",
    category: "Analysis",
    description: "Custom implementation of Black-Scholes and Monte Carlo simulations for options pricing",
    image: "https://images.unsplash.com/photo-1642543348745-03b1219733d9?q=80&w=2072&auto=format&fit=crop",
    technologies: ["Python", "NumPy", "Visualization"]
  },
  {
    id: 6,
    title: "Risk Management Dashboard",
    category: "Dashboard",
    description: "Interactive dashboard for monitoring portfolio risk metrics in real-time",
    image: "https://images.unsplash.com/photo-1560221328-12fe60f83ab8?q=80&w=2074&auto=format&fit=crop",
    technologies: ["React", "D3.js", "Firebase"]
  }
];

const categories = ["All", "Trading", "Analysis", "NLP", "Dashboard"];

function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(projectsData);
    } else {
      setFilteredProjects(projectsData.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-zinc-900 py-20 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">Our Projects</h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-16">
          Explore the cutting-edge quantitative finance projects developed by our club members, 
          featuring algorithmic trading strategies, data analysis tools, and financial models.
        </p>
        
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all 
                ${selectedCategory === category ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Link to={`/projects/${project.id}`} key={project.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-zinc-800 rounded-xl overflow-hidden h-full"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="h-56 overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold bg-zinc-700 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i}
                        className="bg-zinc-700/50 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <motion.div
                    className="flex items-center text-sm text-blue-400 font-medium"
                    animate={activeIndex === index ? { x: 5 } : { x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    View Project <FiArrowRight className="ml-2" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Projects;
