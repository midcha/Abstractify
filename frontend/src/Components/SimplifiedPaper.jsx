import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import './../CSS files/SimplifiedPaper.css';

const SimplifiedPaper = () => {
  const [paperData, setPaperData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`./backend/Outputs/summaryResult.json`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        setPaperData(data);
    
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        
      }
    };

    fetchData();
  }, []);

  const formatSectionType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getSectionColor = (sectionType) => {
    const colors = {
      overview: 'section-overview',
      context: 'section-context',
      methodology: 'section-methodology',
      results: 'section-results',
      discussion: 'section-discussion',
      conclusion: 'section-conclusion',
    };
    return colors[sectionType] || 'section-default';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="loading-spinner">
            <div className="spinner-circle"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="alert alert-error">
            Error loading research data: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!paperData) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="alert">
            No data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{paperData.title}</h2>
      </div>
      <div className="scroll-area">
        <div className="card-content">
          <div className="sections-container">
            {paperData.sections.map((section, index) => (
              <div
                key={index}
                className={`section ${getSectionColor(section.sectionType)}`}
              >
                <div className="section-content">
                  <ChevronRight className="chevron-icon" />
                  <div>
                    <h3 className="section-title">
                      {formatSectionType(section.sectionType)}
                    </h3>
                    <p className="section-text">
                      {section.content}
                    </p>
                    {section.images[0] && (
                      <div className="image-container">
                        <img 
                          src="/api/placeholder/600/300"
                          alt={`Figure for ${section.sectionType}`}
                          className="section-image"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedPaper;
