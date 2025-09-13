import { Locate, Mail, Phone, BookOpen, Globe, Clock, TrendingUp } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaGithub, FaDiscord } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import MaxWidthWrapperNavbar from "./MaxWidthWrapperNavbar";
import { Button } from "../ui/button";

const links = [
	{
		name: "info@quantclub.ai",
		logo: Mail,
	},
	{
		name: "IIT Kharagpur",
		logo: Locate,
	},
];

const footerLinks = [
	{
		title: "Resources",
		links: ["Market Data", "Research Papers", "Tutorials", "API Documentation"],
	},
	{
		title: "About Us",
		links: [
			"Our Mission",
			"Core Team",
			"Research Publications",
			"Academic Partners",
			"Industry Collaborations",
		],
	},
	{
		title: "Learning Center",
		links: ["Webinars", "Workshops", "Model Library", "Code Repository"],
	},
	{
		title: "Connect",
		links: ["Community Forum", "Events Calendar", "Career Opportunities"],
	},
];

const links_social = [
	{
		name: "github",
		logo: FaGithub,
	},
	{
		name: "twitter",
		logo: RiTwitterXLine,
	},
	{
		name: "linkedin",
		logo: FaLinkedinIn,
	},
	{
		name: "discord",
		logo: FaDiscord,
	},
];

const conditions = ["Privacy Policy", "Terms of Service", "Data Usage Policy"];

export const Footer = () => {
	const date = new Date();
	const year = date.getFullYear();

	return (
		<MaxWidthWrapperNavbar className="flex flex-col gap-3">
			<div className="border-2 rounded-lg p-5 space-y-10">
				<div className="flex items-start max-md:flex-col gap-5">
					<div className="space-y-5">
						<div className="flex items-center gap-2">
                            <div className="h-12 w-12 flex items-center justify-center bg-blue-600 rounded-md">
                                <img
                                    src="/quant_club_iit_kharagpur_logo.png"
                                    alt="Quant Club Logo"
                                    className="h-7 w-7 object-contain"
                                />
                            </div>
							<p className="max-sm:text-xs font-bold">QUANT CLUB</p>
						</div>
						<p className="max-w-96 text-muted-foreground">
							Bridging the gap between financial theory and practical
							implementation through cutting-edge algorithms, machine learning,
							and quantitative analysis.
						</p>
						<div className="flex flex-col gap-3">
							{links.map((link, index) => (
								<div key={index} className="flex items-center gap-2">
									<div className="border-2 p-1 rounded-lg bg-blue-300">
										<link.logo size={18} />
									</div>
									<p>{link.name}</p>
								</div>
							))}
						</div>
					</div>
					<div className="grid md:grid-cols-2 grid-col-1 xl:grid-cols-4 md:gap-16 gap-8">
						{footerLinks.map((section, index) => (
							<div key={index} className="space-y-2">
								<h3 className="font-semibold text-lg">{section.title}</h3>
								<ul className="space-y-1">
									{section.links.map((link, linkIndex) => (
										<li
											key={linkIndex}
											className="hover:underline cursor-pointer"
										>
											{link}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<div className="h-0.5 w-full bg-muted-foreground" />
				<div className="flex items-center justify-between max-md:flex-col gap-5">
					<div className="flex items-center gap-5 max-sm:flex-col max-sm:text-xs">
						{conditions.map((condition, index) => (
							<p key={index} className="hover:underline cursor-pointer">
								{condition}
							</p>
						))}
					</div>
					<div className="flex items-center gap-3">
						{links_social.map((link, index) => (
							<Button key={index} size="icon">
								<link.logo size={18} />
							</Button>
						))}
					</div>
				</div>
				<div className="h-0.5 w-full bg-muted-foreground" />
				<p className="text-center text-muted-foreground pb-5 max-sm:text-xs">
					Copyright © {year} Quant Club. All rights reserved.
				</p>
			</div>
		</MaxWidthWrapperNavbar>
	);
};