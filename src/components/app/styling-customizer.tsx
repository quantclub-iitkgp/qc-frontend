"use client"

import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { eventCards } from "@/data/events"
import ImageCard from "../ui/image-card"

export default function StylingCustomizer() {


	return (
		<div className="mx-auto max-w-[1200px] w-full mt-12">
			<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 px-4">
				{eventCards.map((event) => (
					<div
						key={event.id}
						className="flex flex-col rounded-base border-2 border-border bg-background shadow-shadow overflow-hidden transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
					>
						<div className="w-full h-70 overflow-hidden relative">
							<ImageCard
								imageUrl={event.image}
								caption={event.title}
								className="w-full h-full object-cover"
							/>
							<div className="absolute top-3 left-3 bg-main text-main-foreground text-xs py-1 px-2 rounded-base border border-border">
								{event.date}
							</div>
						</div>


					</div>
				))}
			</div>

			<div className="mt-10 text-center">
				<Button className="bg-main text-main-foreground rounded-base border-2 border-border px-8 py-3 shadow-shadow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
					View All Events
				</Button>
			</div>


		</div>
	)
}
