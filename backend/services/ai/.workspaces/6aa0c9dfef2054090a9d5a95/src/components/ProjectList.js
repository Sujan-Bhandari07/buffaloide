import React from 'react';
import projects from '../data/projects';
import './ProjectList.css';

function ProjectList() {
  return (
    <section className="projects">
      <h2>Projects</h2>
      <div className="project-grid">
        {projects.map((proj) => (
          <div key={proj.id} className="project-card">
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
            {proj.link && (
              <a href={proj.link} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectList;
