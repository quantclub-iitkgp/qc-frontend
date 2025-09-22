import { cn } from "@/lib/utils"

type Props = {
  imageUrl: string
  caption: string
  className?: string
}

export default function ImageCard({ imageUrl, caption, className }: Props) {
  return (
    <figure
      className={cn(
        "w-[250px] overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow transition-all duration-200 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none dark:hover:shadow-none group cursor-pointer",
        className,
      )}
    >
      <img className="w-full aspect-4/3 transform transition-transform duration-300 ease-out group-hover:scale-105" src={imageUrl} alt="image" />
      <figcaption className="border-t-2 text-main-foreground border-border p-4">
        {caption}
      </figcaption>
    </figure>
  )
}
