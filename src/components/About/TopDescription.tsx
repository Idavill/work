export default function TopDescription(){
    return(
        <>
              <div className="flex h-fit md:h-fit md:flex-row flex-col gap-x-5 ">
                {/* a typed "+", not the GrAdd icon it replaced. as text it
                    takes a real text-shadow, which is the same thing the
                    left-margin indicator uses in index.css — an svg could only
                    have taken a drop-shadow filter, and the two never quite
                    match on a thin stroke. it also means --color-progress and
                    the font size work the ordinary way.

                    0.1em against text-6xl lands the offset on 6px, exactly the
                    indicator's. em rather than px so resizing the glyph moves
                    the shadow with it.

                    the layout classes are the icon's old ones — flex w-1/6 mb-5
                    md:mb-0 — plus justify-center, which the svg got for free
                    and text does not. GrAdd carried the default
                    preserveAspectRatio="xMidYMid meet", so its viewBox was
                    centred inside this 1/6-width box; a flex container of text
                    defaults to justify-content:flex-start and pinned the glyph
                    to the left edge instead.
                    leading-none stops 60px type reserving a line box far taller
                    than the glyph, which is what keeps it near the old
                    footprint. */}
                <span
                  aria-hidden="true"
                  className="flex justify-center w-1/6 mb-5 md:mb-0 text-6xl leading-none text-progress text-shadow-[0.07em_0.07em_0_var(--color-muted)]"
                >
                  +
                </span>
                <div className="flex w-full h-fit flex-col md:w-5/6">
                  <p className="flex break-words w-full" >{`Software developer with a playful design mindset <3 Passionate about building intuitive tools and user experiences, exploring creative technologies in the intersection of design and technology.`}</p>
                </div>
              </div>
        </>
    )
}