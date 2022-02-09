import { useState } from 'react';
import styled from 'styled-components';
import { generateLibTree } from '@nivo/generators'
import { colorSchemes } from '@nivo/colors'
import { ResponsiveSunburst, ComputedDatum, DatumId } from '@nivo/sunburst';


import { data } from '../../utils/constants/data';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 600px;
`;
interface RawDatum {
    name: string
    loc?: number | undefined
}


console.log("Object generate three", generateLibTree());

export const Chart: React.FC = () => {
    const [dataItem, setDataItem] = useState(data);
    const drillDownColors = colorSchemes.brown_blueGreen[7]
    const drillDownColorMap = {
        Caixa: drillDownColors[0],
        "Renda Fixa": drillDownColors[1],
        "Renda Variável": drillDownColors[2],
        "Fundos Imobiliários": drillDownColors[3],
        "Fundos de Investimento": drillDownColors[4],
        text: drillDownColors[5],
        misc: drillDownColors[6],
    }

    const findObject = (dataOther: any[], name: DatumId) => dataOther.find((searchedName: { name: string; }) => searchedName.name === name)

    const flatten = (data: any[]): any =>
        data.reduce((acc, item) => {
            if (item.children) {
                return [...acc, item, ...flatten(item.children)]
            }

        return [...acc, item]
    }, [])

    const getDrillDownColor = (node: Omit<ComputedDatum<RawDatum>, 'color' | 'fill'>) => {
        const category = [...node.path].reverse()[1] as keyof typeof drillDownColorMap
    
        return drillDownColorMap[category]
    }

    const handleClick = (clickedData: { id: DatumId; }, event: any) => {
        const foundObject = findObject(flatten(data.children), clickedData.id);
        if (foundObject && foundObject.children) {
          setDataItem(foundObject);
        }
      };

    console.log(findObject);

    return (
        <Container>
            <button type='button' onClick={() => setDataItem(data)}>Redefinir</button>
            <ResponsiveSunburst
                isInteractive
                data={dataItem}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                id="name"
                value="loc"
                colors={getDrillDownColor}
                borderWidth={1}
                inheritColorFromParent={false}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.6]],
                }}
                animate={true}
                enableArcLabels
                arcLabel="formattedValue"
                arcLabelsRadiusOffset={0.45}
                arcLabelsSkipAngle={12}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.7
                        ]
                    ]
                }}
                transitionMode="startAngle"
                onClick={handleClick}
                theme={{
                    tooltip: {
                        container: {
                            background: '#333',
                        },
                    },
                }}

            />
        </Container>
    );
}
