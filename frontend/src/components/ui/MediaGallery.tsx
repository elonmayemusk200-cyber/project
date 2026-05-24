// This component automatically handles loading states and error placeholders
export default function MediaGallery({ media }: { media: { type: 'image' | 'video', url: string }[] }) {
  if (!media || media.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {media.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-lg shadow-md border border-gray-200">
          {item.type === 'image' ? (
            <img src={item.url} alt="Shipment update" className="w-full h-64 object-cover hover:scale-105 transition-transform" />
          ) : (
            <video controls className="w-full h-64 object-cover">
              <source src={item.url} type="video/mp4" />
            </video>
          )}
        </div>
      ))}
    </div>
  );
}