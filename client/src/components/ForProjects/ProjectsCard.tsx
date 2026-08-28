import React from 'react';
import { Card } from '../ui/card';
import Image from 'next/image';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

export type TProject = {
    _id: string,
    title: string,
    image: string,
    liveLink: string,
    githubLink: string,
    description: string,
    technologies: string
}

const ProjectsCard = ({project}: {project: TProject}) => {
    return (
        <Card key={project?._id} className="bg-white p-5 rounded shadow-lg hover:shadow-2xl transition-all dark:bg-gray-800">
            <Image
                src={project?.image}
                alt={project?.title}
                width={500} height={500}
                className="rounded w-full h-64"
            />
            <div className="flex items-center justify-between py-4">
                {/* Live Demo Link with Icon */}
                <a
                    href={project?.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 font-medium hover:underline dark:text-blue-400 dark:hover:text-blue-500"
                >
                    <FaExternalLinkAlt className="h-5 w-5 mr-2" /> Live Demo
                </a>
                {/* GitHub Link with Icon */}
                <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 font-medium hover:underline dark:text-blue-400 dark:hover:text-blue-500"
                >
                    <FaGithub className="h-5 w-5 mr-2" /> GitHub
                </a>
            </div>
            <div className="text-start">
                <h3 className="text-xl font-semibold">{project?.title}</h3>
                <p className="text-gray-600 text-sm my-2 dark:text-gray-300">{project?.description.slice(0,120)}...</p>


                <div className="text-center">
                    <a
                        href={`/projects/${project?._id}`}
                        className="text-blue-600 font-medium hover:underline dark:text-blue-400 dark:hover:text-blue-500"
                    >
                        View Details
                    </a>
                </div>
            </div>
        </Card>
    );
};

export default ProjectsCard;