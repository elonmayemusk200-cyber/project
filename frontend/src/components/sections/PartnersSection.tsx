const partners = [
  {
    name: 'Partner 01',
    src: 'https://coexzggshiplogistics.live/temp/custom/images/content/partner-01.png',
  },
  {
    name: 'Partner 02',
    src: 'https://coexzggshiplogistics.live/temp/custom/images/content/partner-02.png',
  },
  {
    name: 'Partner 03',
    src: 'https://coexzggshiplogistics.live/temp/custom/images/content/partner-03.png',
  },
  {
    name: 'Partner 04',
    src: 'https://coexzggshiplogistics.live/temp/custom/images/content/partner-04.png',
  },
  {
    name: 'Partner 05',
    src: 'https://coexzggshiplogistics.live/temp/custom/images/content/partner-05.png',
  },
]

export default function PartnersSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl">
          <p className="section-subtitle">Trusted Partners</p>
          <h2 className="mt-3 section-title text-navy-500">Working with industry leaders to provide the best logistics solutions.</h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Our network of carriers, warehouses, and service partners helps us maintain dependable coverage, faster response times, and consistent service quality.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="rounded-[1.25rem] border border-gray-100 bg-white px-4 py-6 shadow-sm"
            >
              <img
                src={partner.src}
                alt={partner.name}
                className="mx-auto h-14 w-full max-w-[180px] object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}