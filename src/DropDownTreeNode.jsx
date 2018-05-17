import React from 'react';
import RcTree from 'rc-tree';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, Icon } from 'uxcore';

const LOAD_STATUS_LOADING = 1;

class DropdownTreeNode extends RcTree.TreeNode {

  constructor(props) {
    super(props);
  }

  // Icon + Title
  renderSelector = () => {
    const { loadStatus, dragNodeHighlight } = this.state;
    const { title, selected, icon } = this.props;
    const { rcTree: { prefixCls, showIcon, icon: treeIcon, draggable, loadData } } = this.context;
    const disabled = this.isDisabled();

    const wrapClass = `${prefixCls}-node-content-wrapper`;

    // Icon - Still show loading icon when loading without showIcon
    let $icon;

    if (showIcon) {
      const currentIcon = icon || treeIcon;

      $icon = currentIcon ? (
        <span
          className={classNames(
            `${prefixCls}-iconEle`,
            `${prefixCls}-icon__customize`,
          )}
        >
          {typeof currentIcon === 'function' ?
            React.createElement(currentIcon, this.props) : currentIcon}
        </span>
      ) : this.renderIcon();
    } else if (loadData && loadStatus === LOAD_STATUS_LOADING) {
      $icon = this.renderIcon();
    }

    // Title
    const $title = <span className={`${prefixCls}-title`}>{this.renderTitle()}</span>;

    return (
      <span
        ref={this.setSelectHandle}
        title={typeof title === 'string' ? title : ''}
        className={classNames(
          `${wrapClass}`,
          this.getNodeState() ? `${wrapClass}-${this.getNodeState() || 'normal'}` : '',
          (!disabled && (selected || dragNodeHighlight)) && `${prefixCls}-node-selected`,
          (!disabled && draggable) && 'draggable'
        )}
        draggable={(!disabled && draggable) || undefined}
        aria-grabbed={(!disabled && draggable) || undefined}

        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onContextMenu}
        onClick={this.onSelectorClick}
        onDragStart={this.onDragStart}
      >
          {$icon}{$title}
      </span>
    );
  };

  renderTitle() {
    const { title, onDropDownClick, dropDownTitle, dropDownOverlay, dropDownable } = this.props;
    const { rcTree: { prefixCls } } = this.context;

    if (dropDownable) {
      return (
        <span
          className={classNames(
            `${prefixCls}-dropdown-section`,
        )} ref={e => { this.dropDownSectionDom = e; }}
        >
          <span>{title}</span>
          <div
            className={classNames(
              `${prefixCls}-dropdown-section-right-section`,
            )}
          >
            {
              !!dropDownOverlay
              ?
                <Dropdown
                  overlayClassName={classNames(
                    `${prefixCls}-dropdown-menu`,
                  )} overlay={dropDownOverlay} getPopupContainer={() => this.dropDownSectionDom}
                >
                  <Icon
                    className={classNames(
                      `${prefixCls}-dropdown-section-icon`,
                    )} name="shezhi"
                  />
                </Dropdown>
              :
                <Icon
                  className={classNames(
                  `${prefixCls}-dropdown-section-icon`,
                )} name="zengjia" title={dropDownTitle} onClick={e => onDropDownClick(e)}
                />
            }

          </div>
        </span>
      );
    }

    return title;
  }
}

DropdownTreeNode.propTypes = {
  ... RcTree.TreeNode.propTypes,
  onDropDownClick: PropTypes.func,
  dropDownOverlay: PropTypes.node,
  dropDownTitle: PropTypes.string,
  dropDownable: PropTypes.bool,
};

DropdownTreeNode.defaultProps = {
  ... RcTree.TreeNode.defaultProps,
  onDropDownClick: () => {},
  dropDownable: false,
};

export default DropdownTreeNode;