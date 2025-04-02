class CitiesSlider extends React.Component {
    constructor(props) {
      super(props);
  
      this.IMAGE_PARTS = 4;
  
      this.changeTO = null;
      this.AUTOCHANGE_TIME = 4000;
  
      this.state = { activeSlide: -1, prevSlide: -1, sliderReady: false };
    }
  
    componentWillUnmount() {
      window.clearTimeout(this.changeTO);
    }
  
    componentDidMount() {
      this.runAutochangeTO();
      setTimeout(() => {
        this.setState({ activeSlide: 0, sliderReady: true });
      }, 0);
    }
  
    runAutochangeTO() {
      this.changeTO = setTimeout(() => {
        this.changeSlides(1);
        this.runAutochangeTO();
      }, this.AUTOCHANGE_TIME);
    }
  
    changeSlides(change) {
      window.clearTimeout(this.changeTO);
      const { length } = this.props.slides;
      const prevSlide = this.state.activeSlide;
      let activeSlide = prevSlide + change;
      if (activeSlide < 0) activeSlide = length - 1;
      if (activeSlide >= length) activeSlide = 0;
      this.setState({ activeSlide, prevSlide });
    }
  
    render() {
      const { activeSlide, prevSlide, sliderReady } = this.state;
    
      // Define an array of URLs for each slide
      const slideLinks = [
        "Binghatti Properties.html",
        "General trading Tradingservice-details.html",
        "BankingBrokerage-Servives-details.htm",
        "Digital Marketing - Services details.html",
      ];
    
      return (
        React.createElement("div", { className: classNames('slider', { 's--ready': sliderReady }) },
          React.createElement("p", { className: "slider__top-heading" }, ""),
          React.createElement("div", { className: "slider__slides" },
            this.props.slides.map((slide, index) =>
              React.createElement("div", {
                className: classNames('slider__slide', { 's--active': activeSlide === index, 's--prev': prevSlide === index }),
                key: slide.city
              },
                React.createElement("div", { className: "slider__slide-content" },
                  React.createElement("h3", { className: "slider__slide-subheading", style: { color: "white"  }}, slide.country || slide.city),
                  React.createElement("h2", { className: "slider__slide-heading" },
                    slide.city.split(' ').map((word, wordIndex) =>
                      React.createElement("span", { key: wordIndex, style: { marginRight: "10px" } }, word)
                    )
                  ),
                  
                  // Dynamically assign the correct page for each slide
                    React.createElement(
                      "a",
                      { href: slideLinks[index], className: "slider__slide-readmore" },
                      React.createElement("p", { style:{backgroundcolor: "skybule"}}, "Read More")
                    )
                  ),
                React.createElement("div", { className: "slider__slide-parts" },
                  [...Array(this.IMAGE_PARTS).fill()].map((x, i) =>
                    React.createElement("div", { className: "slider__slide-part", key: i },
                      React.createElement("div", { className: "slider__slide-part-inner", style: { backgroundImage: `url(${slide.img})` } })
                    )
                  )
                )
              )
            )
          ),
          React.createElement("div", { className: "slider__control", onClick: () => this.changeSlides(-1) }),
          React.createElement("div", { className: "slider__control slider__control--right", onClick: () => this.changeSlides(1) })
        )
      );
    }
  }    
  
  
  const slides = [
    {
      city: ' Real Estate',
      country: 'Finding Your Dream Home, One Key at a Time',
      img: 'assets/img/bd3.jpg' },
  {
    city: 'Import & Export',
    country: 'Streamline Your Global Trade',
    img: 'assets/img/bd4.jpeg' },
  
  {
    city: 'Banking Brokerage',
    country: 'Navigate the Financial Landscape with Confidence',
    img: 'assets/img/bd1.jpg' },
 
  {
    city: 'Digital Marketing',
    country: ' Digital Growth, Real Business Results',
    img: 'assets/img/bd2.jpeg' }];
  
  
  
  ReactDOM.render(React.createElement(CitiesSlider, { slides: slides }), document.querySelector('#app'));