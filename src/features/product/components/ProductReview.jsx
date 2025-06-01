import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import classNames from "classnames";
import PropTypes from "prop-types";

const review = [
  {
    img: "https://cdn.easyfrontend.com/pictures/users/user20.jpg",
    name: "Alice Capsey",
    rating: 3.5,
    date: "July 11,2020",
    content:
      "Well received seems solid, serious seller and word, fast delivery, thank you and congratulations.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    like: "45",
    dislike: "13",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/users/user11.jpg",
    name: "Kate Cross",
    rating: 4.5,
    date: "july 11,2020",
    content:
      "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment.",
    like: "17",
    dislike: "56",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/users/user10.jpg",
    name: "Maia Bouchier",
    rating: 5,
    date: "july 11,2020",
    content:
      "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilite de un nov lingua franca: On refusa continuar payar custosi traductores. At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles.",
    like: "11",
    dislike: "1",
  },
];

const progress = [
  {
    star: "5",
    value: "70",
    width: "70%",
    count: "123",
  },
  {
    star: "4",
    value: "90",
    width: "90%",
    count: "55",
  },
  {
    star: "3",
    value: "80",
    width: "80%",
    count: "12",
  },
  {
    star: "2",
    value: "60",
    width: "60%",
    count: "4",
  },
  {
    star: "1",
    value: "30",
    width: "30%",
    count: "3",
  },
];

const Rating = ({ rating, showLabel, className, ...rest }) => (
  <p className={classNames("text-sm mb-4", className)} {...rest}>
    <span className="text-blue-600">
      {[...Array(5)].map((_, i) => {
        const index = i + 1;
        let content = "";
        if (index <= Math.floor(rating))
          content = <FontAwesomeIcon icon={faStar} />;
        else if (rating > i && rating < index + 1)
          content = <FontAwesomeIcon icon={faStarHalfAlt} />;
        else if (index > rating) content = <FontAwesomeIcon icon={farStar} />;

        return <Fragment key={i}>{content}</Fragment>;
      })}
    </span>
    {showLabel && <span className="mx-1">{rating.toFixed(1)}</span>}
  </p>
);

Rating.propTypes = {
  rating: PropTypes.number.isRequired,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
};

Rating.defaultProps = {
  showLabel: false,
  className: "",
};

const ReviewItem = ({ item }) => {
  return (
    <>
      <hr className="border-gray-200 my-4" />
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-3">
          <div className="mb-4 flex items-start">
            <div className="h-12 w-12 rounded-full mr-2 overflow-hidden">
              <img src={item.img} alt={item.name} className="max-w-full h-auto" />
            </div>
            <div>
              <h5 className="font-medium my-1">{item.name}</h5>
              <Rating rating={item.rating} showLabel={true} />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-9">
          <p className="text-sm text-gray-600 mb-6">{item.content}</p>
          <div className="flex flex-wrap justify-end items-center">
            <span className="mr-3 text-gray-600">Helpful?</span>
            <button className="hover:text-blue-600 hover:bg-gray-200 border-2 border-gray-200 rounded mr-2 py-1 px-3">
              Yes ({item.like})
            </button>
            <button className="hover:text-blue-600 hover:bg-gray-200 border-2 border-gray-200 rounded py-1 px-3">
              No ({item.dislike})
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ReviewItem.propTypes = {
  item: PropTypes.shape({
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    like: PropTypes.string.isRequired,
    dislike: PropTypes.string.isRequired,
  }).isRequired,
};

const BarItem = ({ info }) => {
  const progressBarStyle = {
    width: info.width,
  };

  return (
    <div className="flex justify-around items-center sm:w-1/2 mb-2">
      <div className="mr-3">
        <p className="text-sm font-bold mb-0">
          <span className="text-gray-500">{info.star}</span>
          <span className="text-blue-600 ml-1">
            <FontAwesomeIcon icon={faStar} />
          </span>
        </p>
      </div>
      <div className="flex-grow mr-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-blue-600"
            style={progressBarStyle}
          ></div>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-0">{info.count}</p>
      </div>
    </div>
  );
};

BarItem.propTypes = {
  info: PropTypes.shape({
    star: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
  }).isRequired,
};

const ProductReview = () => {
  return (
    <section className="py-14 md:py-24 bg-white text-gray-900">
      <div className="container px-4 mx-auto">
        <div className="flex justify-center max-w-4xl mx-auto">
          <div className="bg-blue-50 rounded p-4 lg:p-8">
            <div>
              <div className="p-3 md:p-6">
                <h4 className="text-2xl font-medium mb-2">
                  Reviewer Recommendation
                </h4>
                <div className="text-[40px] text-blue-600">
                  91%
                </div>
                <p className="text-sm text-gray-600 mb-6 md:mb-12">
                  Recommended by 6 reviewers who responded, 5 would recommend this
                  product.
                </p>

                <div className="flex flex-wrap items-center">
                  <span className="text-[40px] text-blue-600">4.5</span>
                  <Rating rating={4.5} className="fs-5" />
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Average rating based on 2345 reviews
                </p>
                <div>
                  {progress.map((info, j) => (
                    <BarItem info={info} key={j} />
                  ))}
                </div>
              </div>
              <hr className="border-gray-200 my-4" />
              <div className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-medium">Customer Review</h2>
                  <div>
                    <button className="text-blue-600 border border-blue-600 hover:text-white hover:bg-blue-600 rounded py-2 px-5 md:px-6 transition-colors">
                      New Comment
                    </button>
                  </div>
                </div>
                {review.map((item, i) => (
                  <ReviewItem item={item} key={i} />
                ))}
              </div>
              <div className="py-6 lg:py-12 text-center">
                <button className="bg-blue-600 text-white text-sm hover:bg-blue-700 rounded py-2.5 px-6 md:px-10 transition-colors">
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReview;
