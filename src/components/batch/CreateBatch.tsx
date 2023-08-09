import React from "react"
import './batch.scss';
import '../global.scss';

import { DefaultTemplate } from "payload/components/templates";
import { AdminView } from "payload/config";
import  formatFields from 'payload/dist/admin/components/views/collections/Edit/formatFields';
import { Props } from "../types";


const CreateBatch: React.FC = (props: Props) => {

    console.log('///CreateBatch Props', props);

    return  (
        <section>
            <section>

        <h2> Create New Batch</h2>

        </section>

        </section>
    )
}

export default CreateBatch;