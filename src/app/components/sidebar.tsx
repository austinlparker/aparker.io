import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faBluesky,
  faSignalMessenger,
} from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ProfileViewDetailedLike = {
  avatar?: string;
  displayName?: string;
};

interface SidebarProps {
  profile: ProfileViewDetailedLike;
}

interface SocialLink {
  icon: IconDefinition;
  url: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { icon: faGithub, url: "https://github.com/austinlparker", label: "GitHub" },
  {
    icon: faLinkedin,
    url: "https://linkedin.com/in/austinlparker",
    label: "LinkedIn",
  },
  {
    icon: faBluesky,
    url: "https://bsky.app/profile/aparker.io",
    label: "BlueSky",
  },
  {
    icon: faSignalMessenger,
    url: "https://signal.me/#eu/vOv3cTXK-5szYTFS2C0cQEuGjV8NGBFK332dpFAmwdoWmzKMDgdA2IDFssglf8C3",
    label: "Signal",
  },
  // Add more social links as needed
];

export function Sidebar({ profile }: SidebarProps) {
  return (
    <div className="standard-dialog md:w-1/3 order-last md:order-first flex flex-col items-center">
      <div className="flex items-center justify-center bg-gray-200 rounded-lg p-2 mb-4">
        <div className="relative w-16 h-16 mr-4">
          {profile.avatar ? (
            <img
              className="rounded-lg w-full h-full object-cover border-2 border-black"
              src={profile.avatar}
              alt={`${profile.displayName}'s avatar`}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-lg border-2 border-black"></div>
          )}
        </div>
        <h1 className="text-2xl font-bold">aparker.io</h1>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FontAwesomeIcon icon={link.icon} size="lg" title={link.label} />
          </a>
        ))}
      </div>

      <div className="w-full">
        <h2 className="text-lg font-semibold mb-2">Links</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://learningopentelemetry.com"
              className="hover:underline"
            >
              Learning OpenTelemetry
            </a>
          </li>
          <li>
            <a
              href="https://openprofile.dev/profile/austinlparker"
              className="hover:underline"
            >
              CNCF OpenProfile
            </a>
          </li>
          <li>
            <a href="https://desertedisland.club" className="hover:underline">
              Deserted Island DevOps
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
