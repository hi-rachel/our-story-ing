import { useEffect, useState } from 'react';

export const useAnimatingHeart = () => {
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating((prev) => !prev);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	const heartVariants = {
		beat: {
			scale: [1, 1.1, 1],
			transition: {
				duration: 0.5,
			},
		},
	};

	return { isAnimating, heartVariants };
};
