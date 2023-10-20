import React, {MouseEventHandler} from "react";

export class Pagination extends React.Component<{
  pageNum: number;
  totalPages:  number | null | undefined;
  nextPageClick: MouseEventHandler;
  prevPageClick: MouseEventHandler;
}> {
  render() {
    return <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
      {this.props.pageNum > 1 ?
        (<button onClick={this.props.prevPageClick}
                 className="focus:outline-none font-medium text-2xl">&larr;</button>)
        : <div></div>
      }
      <span>
        Page {this.props.pageNum} of {this.props.totalPages}
      </span>
      {this.props.pageNum !== this.props.totalPages ?
        (<button onClick={this.props.nextPageClick}
                 className="focus:outline-none font-medium text-2xl">&rarr;</button>)
        : <div></div>
      }
    </div>;
  }
}
