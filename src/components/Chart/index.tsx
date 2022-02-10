import { useState } from 'react';
import styled from 'styled-components';
import { colorSchemes } from '@nivo/colors'
import { ResponsiveSunburst, DatumId } from '@nivo/sunburst';


import { data } from '../../utils/constants/data';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 600px;

    .button {
        background-color: blue;
        color: white;
        max-width: 200px;
        margin-left: 200px;
        border-radius: 4px;
        border: none;
        padding: 8px 16px;
        cursor: pointer;

        :hover {
            background-color: #2157e0;
        }
    }
`;

const Legends = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: -100px;
    margin-left: 200px;

    > div{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        max-height: 30px;
        
    }
    .color {
        height: 20px;
        width: 20px;
        padding: 0px;
    }
    
    
`;
// interface RawDatum {
//     name: string
//     loc?: number | undefined
// } -> Interface para a personalização de cores

export const Chart: React.FC = () => {
    const [dataItem, setDataItem] = useState(data);
    const drillDownColors = colorSchemes.set2
    // const drillDownColorMap = {
    //     Caixa: drillDownColors[0],
    //     "Renda Fixa": drillDownColors[1],
    //     "Renda Variável": drillDownColors[2],
    //     "Fundos Imobiliários": drillDownColors[3],
    //     "Fundos de Investimento": drillDownColors[4],
    // } -> para a função de personalização de cores

    const findObject = (dataOther: any[], name: DatumId) => dataOther.find((searchedName: { name: string; }) => searchedName.name === name)

    const flatten = (data: any[]): any =>
        data.reduce((acc, item) => {
            if (item.children) {
                return [...acc, item, ...flatten(item.children)]
            }

        return [...acc, item]
    }, [])

    // const getDrillDownColor = (node: Omit<ComputedDatum<RawDatum>, 'color' | 'fill'>) => {
    //     const category = [...node.path].reverse()[1] as keyof typeof drillDownColorMap
    
    //     return drillDownColorMap[category]
    // } -> Função para personalizar as cores do filho como o do pai
    
    const calcPercent = (data: {name: string, color: string, loc: number}[], value: number) => {
        const total = data.reduce((acc,item) => acc + item.loc, 0);
        return Number(((100 * value) / total).toFixed(0));
    }

    const handleClick = (clickedData: { id: DatumId; }, event: any) => {
        const foundObject = findObject(flatten(data.children), clickedData.id);
        if (foundObject && foundObject.children) {         
          setDataItem({...foundObject, children: foundObject.children.map((item: any) => ({...item, loc: calcPercent(foundObject.children, item.loc)}))});
        }
      };

    return (
        <Container>
            <button type='button' className='button' onClick={() => setDataItem(data)}>Redefinir</button>
            <ResponsiveSunburst
                valueFormat=">-.2"
                value="loc"
                id="name"
                isInteractive
                data={dataItem}
                cornerRadius={3}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                // colors={getDrillDownColor}
                colors={{scheme: "set2"}}
                borderWidth={1}
                inheritColorFromParent
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.6]],
                }}
                animate={true}
                enableArcLabels
                arcLabel={d => `${d.value}%`}
                arcLabelsRadiusOffset={0.45}
                arcLabelsSkipAngle={8}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.7
                        ]
                    ]
                }}
                transitionMode="middleAngle"
                onClick={handleClick}
                theme={{
                    tooltip: {
                        container: {
                            background: '#333',
                        },
                    },
                    labels: {
                        text: {
                            fontSize: 18,
                            fontWeight: 'bold'
                        }
                    }
                }}
            />

            <Legends>
                {dataItem.children.map((item,index) => (
                    <div>
                        <div className="color" style={{ background: `${drillDownColors[index]}` }} />
                        <p>{item.name}</p>
                    </div>
                ))}
                
            </Legends>
        </Container>
    );
}
