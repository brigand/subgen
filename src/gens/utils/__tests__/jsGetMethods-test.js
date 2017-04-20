import outdent from 'outdent';
import jsGetMethods from '../jsGetMethods';

it(`works`, () => {
  const src = outdent`
  const a = 1;
  b()
  class C {
    c(){
      x
    }
    d(){
      x
    }
  }
  `;

  expect(jsGetMethods(src)).toEqual([
    { name: `c`, start: 3, end: 5 },
    { name: `d`, start: 6, end: 8 },
  ]);
});

it(`works on complex example`, () => {
  const src = outdent`
  import React, {PropTypes} from 'react';
  import {findDOMNode} from 'react-dom';
  import classnames from 'classnames';
  import './Box.less';

  /**
   Box is a primitive container with sensible flexbox defaults.
   The props control the box-model parameters in a convienent way that allows
   layout from within the view.

   This reduces boilerplate overall.
   **/


  function directionalToString(x, prefix) {
    if (!x) return null;
    if (typeof x === 'string') return {[prefix]: x};
    const styles = {};
    if ('top' in x) styles[\`\${prefix}Top\`] = x.top;
    if ('right' in x) styles[\`\${prefix}Right\`] = x.right;
    if ('bottom' in x) styles[\`\${prefix}Bottom\`] = x.bottom;
    if ('left' in x) styles[\`\${prefix}Left\`] = x.left;
    return styles;
  }


  const stylePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      top: PropTypes.string,
      right: PropTypes.string,
      bottom: PropTypes.string,
      left: PropTypes.string,
    }),
  ]);

  const numberOrStringPropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]);

  export default
  class Box extends React.Component {
    static propTypes = {
      tag: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
      ]),

      className: PropTypes.string,
      direction: PropTypes.oneOf(['row', 'column']),
      mobileDirection: PropTypes.oneOf(['row', 'column']),
      tabletDirection: PropTypes.oneOf(['row', 'column']),
      margin: stylePropType,
      padding: stylePropType,
      grow: numberOrStringPropType,
      shrink: numberOrStringPropType,
      justify: PropTypes.string,
      inline: PropTypes.bool,
      size: numberOrStringPropType,
      wrap: PropTypes.oneOf([true, 'wrap', 'wrap-reverse']),
      align: PropTypes.oneOf(['start', 'end', 'center']),
      alignItems: PropTypes.string,
      noPointer: PropTypes.bool,
      onClick: PropTypes.func,

      flex: PropTypes.number,
      closePortal: PropTypes.func,
      style: PropTypes.object,
      channel: PropTypes.object,

      /**
       This is used to allow a fast shouldComponentUpdate for when children
       infrequently update. Passing the same childrenId on the second render
       considers children to be equal.
       **/
      childrenId: PropTypes.any,

      // used for unit testing selectors
      testId: PropTypes.any,

      // optional ref to the root dom element or custom component
      rootRef: PropTypes.func,
    };

    static defaultProps = {
      // intentionally omitted
      // direction: 'column',
      tag: 'span',
      // margin: null,
      // padding: null,
      // grow: null,
      // shrink: null,
      // justify: null,
      // inline: false,
    };

    constructor(props) {
      super(props);
      this.refCallback = (ref) => {
        this.boxRef = ref;
        if (this.props.rootRef) {
          this.props.rootRef(ref);
        }
      };
    }

    getNode() {
      console.warn(\`Box atom: instance.getNode() is deprecated; use the rootRef prop\`);
      return findDOMNode(this.boxRef);
    }

    render() {
      const {
        tag,
        className, style,
        direction, mobileDirection, tabletDirection, inline,
        margin, padding,
        channel,
        grow, shrink, size, wrap, align, alignItems, justify,
        // from react-portal
        ...props
      } = this.props;

      delete props.flex;
      delete props.closePortal;
      delete props.testId;
      delete props.rootRef;

      const mod = s => \`BoxAtom--\${s}\`;

      if (channel && channel.hasAction("autoclose")) {
        // we need ONLY Capture event here, to make Box close event handled before
        // Select opens its dropdown, otherwise Select will be always closed
        props.onClickCapture = () => {
          channel.publish({close: true});
        };
      }

      let adjustedDirection = direction;
      if (!direction) {
        if (this.props.inline) adjustedDirection = 'row';
        else adjustedDirection = 'column';
      }

      // merge the class names
      const fullClassName = classnames(
        className,
        'BoxAtom',
        adjustedDirection === 'row' ? mod('row') : mod('column'),
        mobileDirection === 'row' && mod('mobile-row'),
        mobileDirection === 'column' && mod('mobile-column'),
        tabletDirection === 'row' && mod('tablet-row'),
        tabletDirection === 'column' && mod('tablet-column'),
        inline ? mod('inline') : mod('block'),
        alignItems && mod(\`alignItems-\${alignItems}\`),
        align && mod(\`align-\${align}\`),
        typeof wrap === 'string' && mod(\`wrap-\${wrap}\`),
        wrap === true && mod('wrap-wrap'),
        justify && mod(\`justifyContent-\${justify}\`),
        this.props.onClick && !this.props.noPointer && mod('clickable'),
      );

      // inline styles which are merged with the style prop
      const ownStyle = Object.assign({},
        directionalToString(margin, 'margin'),
        directionalToString(padding, 'padding'),
      );

      const setPrefixedStyle = (name, value) => {
        ownStyle[name] = value;
        const base = name[0].toUpperCase() + name.slice(1);
        ownStyle[\`Webkit\${base}\`] = value;
        // FIXME: which one of thses is it?
        ownStyle[\`ms\${base}\`] = value;
      };

      if (grow != null) setPrefixedStyle('flexGrow', String(grow));
      if (shrink != null) setPrefixedStyle('flexShrink', String(shrink));
      if (size != null) setPrefixedStyle('flexBasis', String(size));

      const Tag = tag;

      // We use a span here due to html restrictions involving divs.
      // Because it gets display:flex/inline-flex there aren't any style differences.
      return (
        <Tag
          ref={this.refCallback}
          {...props}
          className={fullClassName}
          style={style ? Object.assign(ownStyle, style) : ownStyle}
        />
      );
    }
  }
  `;
  expect(jsGetMethods(src)).toMatchSnapshot();
});
