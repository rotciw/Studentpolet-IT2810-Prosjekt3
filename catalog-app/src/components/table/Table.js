import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { observer, inject } from 'mobx-react';
import BootstrapTable from 'react-bootstrap-table-next';
import './Table.css';

// Columns which are displayed in the table
const columns = [{
  dataField: 'Varenavn',
  text: 'Varenavn'
}, {
  dataField: 'Varetype',
  text: 'Varetype'
}, {
  dataField: 'Pris',
  text: 'Pris (i kr)'
}, {
  dataField: 'AlkoholPrKrone',
  text: 'Alkohol per krone'
}
];

const expandRow = {
  renderer: row => (
    <div className="row">
      <div className="col-sm text-center">
        {/* Images are fetched from vinmonopolet's website */}
        <img
          src={"https://bilder.vinmonopolet.no/cache/250x250-0/" + row.Varenummer + "-1.jpg"}
          alt="Item"
        />
      </div>
      {/* We want to always show this information for each item */}
      <div className="col-sm">
        <p>{`Varenummer: ${row.Varenummer}`}</p>
        <p>{`Varenavn: ${row.Varenavn}`}</p>
        <p>{`Varetype: ${row.Varetype}`}</p>
        <p>{`Land: ${row.Land}`}</p>
      </div>
      <div className="col-sm">
        <p>{`Volum: ${row.Volum} liter`}</p>
        <p>{`Alkoholprosent: ${row.Alkohol}%`}</p>
        <p>{`Årgang: ${row.Argang}`}</p>
        <p>{`Smak: ${row.Smak}`}</p>
      </div>
      <div className="col-sm">
        <p>{`Literpris: ${row.Literpris} kr`}</p>
        <p>{`Emballasjetype: ${row.Emballasjetype} `}</p>
        <p>{`Produktutvalg: ${row.Produktutvalg} `}</p>
        <p><a target="_blank" rel="noopener noreferrer" href={row.Vareurl}>{`Link til produktet`}</a></p>
      </div>
    </div>

  ),
  className: 'expandedRow',
  parentClassName: 'parentExpandedRow'
};

function emptyTable() {
  // When the table is empty, communicate it to the paginationstore
  this.props.paginationStore.tableEmpty();
  return "Ingen data";
}

class Table extends Component {
  refreshQuery(keys = "", packaging = "", productSelection = "", country = "",
    yearMin = "", yearMax = "", priceMin, priceMax,
    skipping = 0, sortAfter = "") {
    // Availbale queries
    const GET_PRODUCTQUERY = gql`
      {
        productQuery(Keys: "${keys}",
                     Packaging: "${packaging}",
                     ProductSelection: "${productSelection}",
                     Country: "${country}",
                     YearMin: "${yearMin}",
                     YearMax: "${yearMax}",
                     PriceMin: ${priceMin},
                     PriceMax: ${priceMax},
                     Skipping: ${skipping},
                     SortAfter: "${sortAfter}") {
          Varenummer
          Varenavn
          Volum
          Pris
          Literpris
          Varetype
          Produktutvalg
          Smak
          Land
          Argang
          Alkohol
          AlkoholPrKrone
          Emballasjetype
          Vareurl
        }
      }`;
    return GET_PRODUCTQUERY;
  };

  render() {
    return (
      <div className="tableContainer">
        {/* Queries after these filters */}
        <Query query={
          this.refreshQuery(
            this.props.searchBarStore.searchBarValue,
            this.props.filterStore.packagingFilter,
            this.props.filterStore.productSelectionFilter,
            this.props.filterStore.countryFilter,
            this.props.filterStore.yearMinFilter,
            this.props.filterStore.yearMaxFilter,
            this.props.filterStore.priceMinFilter,
            this.props.filterStore.priceMaxFilter,
            this.props.paginationStore.paginationPage,
            this.props.sortStore.sortAfter)
        }
        >
          {({ loading, error, data }) => {
            if (loading && !data) return (
              <div className="card">
                Loading...
              </div>
            );
            if (error) return `Error! ${error.message}`;
            // Pagination check
            // If the table was empty, the next state shall be not empty
            if (this.props.paginationStore.tableIsEmpty === true) {
              this.props.paginationStore.tableNotEmpty();
            }
            return (
              <div className="card">
                <BootstrapTable
                  id="table"
                  headerClasses="tableHeader"
                  keyField='Varenummer'
                  data={data.productQuery}
                  columns={columns}
                  expandRow={expandRow}
                  bootstrap4={true}
                  hover={true}
                  bordered={true}
                  noDataIndication={emptyTable.bind(this)}
                />
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default inject('sortStore', 'filterStore', 'searchBarStore', 'paginationStore')(observer(Table));