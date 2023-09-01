import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowInfo } from '@faceless-ui/window-info';
import Eyebrow from 'payload/dist/admin/components/elements/Eyebrow';
import Paginator from 'payload/dist/admin/components/elements/Paginator';
import ListControls from 'payload/dist/admin/components/elements/ListControls';
import ListSelection from 'payload/dist/admin/components/elements/ListSelection';
import Pill from 'payload/dist/admin/components/elements/Pill';
import Button from 'payload/dist/admin/components/elements/Button';
import { Table } from 'payload/dist/admin/components/elements/Table';
import Meta from 'payload/dist/admin/components/utilities/Meta';
import { ListCollectionProps as Props } from '../types';
import ViewDescription from 'payload/dist/admin/components/elements/ViewDescription';
import PerPage from 'payload/dist/admin/components/elements/PerPage';
import { Gutter } from 'payload/dist/admin/components/elements/Gutter';
import { RelationshipProvider } from 'payload/dist/admin/components/views/collections/List/RelationshipProvider';
import { getTranslation } from 'payload/dist/utilities/getTranslation';
import { StaggeredShimmers } from 'payload/dist/admin/components/elements/ShimmerEffect';
import { SelectionProvider } from 'payload/dist/admin/components/views/collections/List/SelectionProvider';
import EditMany from 'payload/dist/admin/components/elements/EditMany';
import DeleteMany from 'payload/dist/admin/components/elements/DeleteMany';
import PublishMany from 'payload/dist/admin/components/elements/PublishMany';
import UnpublishMany from 'payload/dist/admin/components/elements/UnpublishMany';
import formatFilesize from '../../helpers/formatFileSize';
import CredentialsCollection from '../../collections/Credentials';

import './index.scss';

const baseClass = 'collection-list';
const emptyData = {
    docs: [],
    totalDocs: null,
}

const BatchCredentialListPreview: React.FC= () => {

    const [ data, setData] = useState(emptyData);
 
    const collection = CredentialsCollection;
    const disableEyebrow = true;
   

  useEffect(() => {
    const fetchBatchCredentials= async () => {
      const res = await fetch("/api/get-batch-credentials", {
        method: "POST",
        body: JSON.stringify({batchId: '64f119591136bd8c4603b97e'}),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
      });
      if (res.status === 200) {
        const { data } = await res.json();
        setData(data);
        console.log("///get batch credentials", data);
      }
    };

    fetchBatchCredentials();
  }, []);

  const { breakpoints: { s: smallBreak } } = useWindowInfo();
  const { t, i18n } = useTranslation('general');
  let formattedDocs = data.docs || [];

  console.log('//formattedDocs', formattedDocs);

  if (collection.upload) {
    formattedDocs = formattedDocs?.map((doc) => {
      return {
        ...doc,
        filesize: formatFilesize(doc.filesize),
      };
    });
  }

  return (
    <div className={baseClass}>
     
      {/* <SelectionProvider
        docs={data.docs}
        totalDocs={data.totalDocs}
      > */}
        {!disableEyebrow && (
          <Eyebrow />
        )}
        <Gutter className={`${baseClass}__wrap`}>
        
          {/* <ListControls
            collection={collection}
            modifySearchQuery={modifySearchParams}
            handleSortChange={handleSortChange}
            handleWhereChange={handleWhereChange}
            resetParams={resetParams}
          />
       */}
          {!data.docs && (
            <StaggeredShimmers
              className={[`${baseClass}__shimmer`, `${baseClass}__shimmer--rows`].join(' ')}
              count={6}
            />
          )}
          {(data.docs && data.docs.length > 0) && (
            <RelationshipProvider>
              <Table data={formattedDocs} />
            </RelationshipProvider>
          )}
          {data.docs && data.docs.length === 0 && (
            <div className={`${baseClass}__no-results`}>
              <p>
                {t('noResults', { label: getTranslation('Credentials', i18n) })}
              </p>
            
            </div>
          )}
       

          {/* <div className={`${baseClass}__page-controls`}>
            <Paginator
              limit={data.limit}
              totalPages={data.totalPages}
              page={data.page}
              hasPrevPage={data.hasPrevPage}
              hasNextPage={data.hasNextPage}
              prevPage={data.prevPage}
              nextPage={data.nextPage}
              numberOfNeighbors={1}
              disableHistoryChange={modifySearchParams === false}
              onChange={handlePageChange}
            />
            {data?.totalDocs > 0 && (
              <Fragment>
                <div className={`${baseClass}__page-info`}>
                  {(data.page * data.limit) - (data.limit - 1)}
                  -
                  {data.totalPages > 1 && data.totalPages !== data.page ? (data.limit * data.page) : data.totalDocs}
                  {' '}
                  {t('of')}
                  {' '}
                  {data.totalDocs}
                </div>
                <PerPage
                  limits={collection?.admin?.pagination?.limits}
                  limit={limit}
                  modifySearchParams={modifySearchParams}
                  handleChange={handlePerPageChange}
                  resetPage={data.totalDocs <= data.pagingCounter}
                />
                <div className={`${baseClass}__list-selection`}>
                  {smallBreak && (
                    <Fragment>
                      <ListSelection
                        label={getTranslation(collection.labels.plural, i18n)}
                      />
                      <div className={`${baseClass}__list-selection-actions`}>
                        <EditMany
                          collection={collection}
                          resetParams={resetParams}
                        />
                        <PublishMany
                          collection={collection}
                          resetParams={resetParams}
                        />
                        <UnpublishMany
                          collection={collection}
                          resetParams={resetParams}
                        />
                        <DeleteMany
                          collection={collection}
                          resetParams={resetParams}
                        />
                      </div>
                    </Fragment>
                  )}
                </div>
              </Fragment>
            )}
          </div> */}
        </Gutter>
      {/* </SelectionProvider> */}
     
    </div>
  );
};

export default BatchCredentialListPreview;
