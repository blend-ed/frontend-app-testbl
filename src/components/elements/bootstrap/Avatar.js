// import node module libraries
import { Image } from 'react-bootstrap';
import PropTypes from 'prop-types';

// import tippy tooltip
import Tippy from '@tippyjs/react';

// import avatar image
import AvatarImg from '../../../assets/images/avatar/avatar.png';

const Avatar = (props) => {
    const {
        size,
        type,
        src,
        alt,
        name,
        className,
        status,
        soft,
        variant,
        showExact,
        imgtooltip,
        bodyClasses,
        theme
    } = props;

    const GetAvatar = () => {
        if (type === 'initial' && name) {
            var matches = name.match(/\b(\w)/g);
            var acronym = showExact ? name : matches.join('');
            if (soft) {
                return imgtooltip ? (
                    <Tippy
                        content={<small className="mb-0">{name}</small>}
                        theme={theme}
                        animation={'scale'}
                    >
                        <span
                            className={`avatar avatar-${size} avatar-${variant}-soft me-0 mb-2 mb-lg-0`}
                        >
                            <span className={`avatar-initials ${className}`}>{acronym}</span>
                        </span>
                    </Tippy>
                ) : (
                    <span
                        className={`avatar avatar-${size} avatar-${variant}-soft me-0 mb-2 mb-lg-0`}
                    >
                        <span className={`avatar-initials ${className}`}>{acronym}</span>
                    </span>
                );
            }
            if (imgtooltip && name) {
                return (
                    <Tippy
                        content={<small className="mb-0">{name}</small>}
                        theme={theme}
                        animation={'scale'}
                    >
                        <span
                            title={alt}
                            className={`avatar avatar-${size} avatar-primary me-0 mb-2 mb-lg-0 ${status ? 'avatar-indicators avatar-' + status : ''
                                }`}
                        >
                            <span className={`avatar-initials bg-${variant} ${className}`}>
                                {acronym}
                            </span>
                        </span>
                    </Tippy>
                );
            } else {
                return (
                    <span
                        title={alt}
                        className={`avatar avatar-${size} avatar-primary me-0 mb-2 mb-lg-0 ${status ? 'avatar-indicators avatar-' + status : ''
                            }`}
                    >
                        <span className={`avatar-initials bg-${variant} ${className}`}>
                            {acronym}
                        </span>
                    </span>
                );
            }
        } else if (type === 'image' && src) {
            if (imgtooltip && name) {
                return (
                    <span
                        className={`avatar avatar-${size} me-1 ${status ? 'avatar-indicators mb-2 mb-lg-0 avatar-' + status : ''
                            } ${bodyClasses ? bodyClasses : ''}`}
                    >
                        <Tippy
                            content={<small className="mb-0 fw-bold">{name}</small>}
                            theme={theme == 'light' ? theme : ''}
                            animation={'scale'}
                        >
                            <Image
                                src={src}
                                alt={alt}
                                className={`mb-2 mb-lg-0 ${className}`}
                                onError={(e) => {
                                    e.target.src = AvatarImg;
                                }}
                            />
                        </Tippy>
                    </span>
                );
            } else {
                return (
                    <span
                        className={`avatar avatar-${size} me-0 ${status ? 'avatar-indicators mb-2 mb-lg-0 avatar-' + status : ''
                            }`}
                    >
                        <Image
                            src={src}
                            alt={alt}
                            className={`mb-2 mb-lg-0 ${className}`}
                            onError={(e) => {
                                e.target.src = AvatarImg;
                            }}
                        />
                    </span>
                );
            }
        } else {
            return (
                <span
                    dangerouslySetInnerHTML={{
                        __html: 'Avatar'
                    }}
                ></span>
            );
        }
    };
    return <GetAvatar />;
};

Avatar.propTypes = {
    size: PropTypes.oneOf(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']),
    type: PropTypes.oneOf(['image', 'initial']),
    src: PropTypes.string,
    alt: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.oneOf(['online', 'away', 'offline', 'busy']),
    className: PropTypes.string,
    variant: PropTypes.oneOf([
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark'
    ]),
    soft: PropTypes.bool,
    showExact: PropTypes.bool,
    imgtooltip: PropTypes.bool,
    bodyClasses: PropTypes.string,
    theme: PropTypes.string
};

Avatar.defaultProps = {
    className: '',
    size: 'md',
    variant: 'primary',
    soft: false,
    showExact: false,
    theme: 'dark'
};

const AvatarGroup = (props) => {
    return (
        <div className={`avatar-group ${props.className ? props.className : ''}`}>
            {props.children}
        </div>
    );
};
const Ratio = (props) => {
    const { src, size, className } = props;
    return (
        <span>
            <Image
                src={src}
                alt=""
                className={`img-4by3-${size} mb-2 mb-lg-0 ${className}`}
                onError={(e) => {
                    e.target.src = AvatarImg;
                }}
            />
        </span>
    );
};

export { Avatar, AvatarGroup, Ratio };
